/**
 * User history orchestrator — 11-step sync cycle.
 *
 * Patterns applied:
 *   Facade          — getUserHistory() is the single public entry point.
 *   Memento         — PortfolioMemento captures / restores portfolio state via
 *                     UserHistoryCache.portfolioJson with a typed contract.
 *   Template Method — _run() calls named step functions (step1…step10) in a
 *                     fixed sequence; each step owns its own error path.
 *
 * Called by both the REST route and the tRPC procedure.
 */

import { randomUUID } from "crypto";
import { getAddress } from "viem";
import type { UserActivity, UserHistoryCache } from "@prisma/client";
import { db } from "@/lib/db";
import {
  fetchEnvioHead,
  fetchAllUserEvents,
  fetchDerivedAndGlobalState,
  makeEventCursor,
  ZERO_CURSOR,
} from "@/shared/api/userHistoryEnvio";
import type { TouchedMarkets } from "@/shared/api/userHistoryEnvio";
import { CURRENT_SCHEMA_VERSION } from "@/shared/types/history";
import type {
  HistoryResponse,
  ActivityItem,
  ActivityKind,
  PortfolioBreakdown,
  VaultPosition,
  RydPosition,
  CpfPosition,
  TwoPoolPosition,
} from "@/shared/types/history";
import type {
  UserDeltaResponse,
  UserDerivedStateResponse,
  GlobalStateResponse,
  RawCPFPoolState,
  RawRYDState,
} from "@/shared/types/envioRaw";
import {
  mapAllDeltaToActivities,
  computePortfolio,
  formatActivityTitle,
  fetchActivityTitleContext,
  resolveCpfEventTitle,
  resolveTwoPoolName,
  toUtcDateBucket,
  toBucketTs,
  type PortfolioPointRow,
  type ActivityForState,
  type ActivityTitleContext,
  makeHistoricalUserState,
  applyEvent,
  valuateDay,
} from "@/shared/utils/userHistory";

/** Number of daily chart points returned to clients (most recent window). */
const CHART_WINDOW_DAYS = 90;

// ─── Public response type ─────────────────────────────────────────────────────

/**
 * Extends HistoryResponse with an optional `stale` field.
 * When Envio is unreachable but a cache row exists, the orchestrator returns
 * the cached portfolio with `stale` set. The REST route and tRPC procedure
 * propagate this field to the client, which shows a "may be outdated" banner.
 */
export type HistoryServiceResponse = HistoryResponse & {
  stale?: { cachedAt: string; syncedAtBlock: string };
};

// ─── Memento: typed portfolio snapshot ───────────────────────────────────────

/**
 * In-memory representation of a portfolio snapshot.
 * Provides a stable typed contract between the sync cycle and the cache layer.
 */
interface PortfolioMemento {
  totalValueUsdc: string;
  breakdown: PortfolioBreakdown;
  positions: {
    vaults: VaultPosition[];
    ryds: RydPosition[];
    cpfBets: CpfPosition[];
    twoPools: TwoPoolPosition[];
  };
  /** Last date bucket written — used by step 9 to resume carry-forward. */
  lastBucketDate: string | null;
}

type ComputedPortfolio = ReturnType<typeof computePortfolio>;

/**
 * Serialise a computed portfolio to the flat JSON shape stored in
 * UserHistoryCache.portfolioJson (breakdown fields spread at top level for
 * backwards compatibility with existing DB rows).
 */
function serializePortfolio(
  p: ComputedPortfolio,
  lastBucketDate: string,
): PortfolioBreakdown & {
  totalValueUsdc: string;
  positions: ComputedPortfolio["positions"];
  lastBucketDate: string;
} {
  return {
    ...p.breakdown,
    totalValueUsdc: p.totalValueUsdc,
    positions: p.positions,
    lastBucketDate,
  };
}

/**
 * Deserialise raw DB JSON into a typed PortfolioMemento.
 * Handles the flat-spread format written by serializePortfolio; missing fields
 * default to "0" / empty arrays so stale or partial rows degrade gracefully.
 */
function deserializePortfolio(json: unknown): PortfolioMemento {
  const pj = (json as Record<string, unknown>) ?? {};
  const str = (k: string): string =>
    typeof pj[k] === "string" ? (pj[k] as string) : "0";
  const rawPos = (pj.positions ?? {}) as Record<string, unknown[]>;
  return {
    totalValueUsdc: str("totalValueUsdc"),
    breakdown: {
      vaultPrincipal: str("vaultPrincipal"),
      vaultClaimableYield: str("vaultClaimableYield"),
      freeYt: str("freeYt"),
      cpfOpen: str("cpfOpen"),
      cpfClaimable: str("cpfClaimable"),
      rydLocked: str("rydLocked"),
      rydClaimable: str("rydClaimable"),
      twoPoolLocked: str("twoPoolLocked"),
      twoPoolClaimable: str("twoPoolClaimable"),
    } satisfies PortfolioBreakdown,
    positions: {
      vaults: (rawPos.vaults ?? []) as VaultPosition[],
      ryds: (rawPos.ryds ?? []) as RydPosition[],
      cpfBets: (rawPos.cpfBets ?? []) as CpfPosition[],
      twoPools: (rawPos.twoPools ?? []) as TwoPoolPosition[],
    },
    lastBucketDate:
      typeof pj.lastBucketDate === "string" ? pj.lastBucketDate : null,
  };
}

// ─── Template Method: per-run context ────────────────────────────────────────

/** Carries immutable setup data through the Template Method step chain. */
interface SyncContext {
  address: string;
  t0: number;
  cache: UserHistoryCache | null;
  isSchemaStale: boolean;
  lastBlock: bigint;
  /** Envio cursor: string of the form `${chainId}_${block12}_${logIndex5}`. */
  cursor: string;
  cachedMarkets: TouchedMarkets;
  /** Typed memento restored from cache; null on first-ever sync. */
  memento: PortfolioMemento | null;
}

// ─── Stale-fallback signal ────────────────────────────────────────────────────

/**
 * Thrown by step functions when Envio is unreachable and a cached row exists.
 * Caught once at the top of _run — eliminates the duplicated catch blocks in
 * step 2 and steps 4–6.
 */
class StaleFallbackError extends Error {
  constructor(public readonly response: HistoryServiceResponse) {
    super("stale-fallback");
  }
}

// ─── Concurrency guard ────────────────────────────────────────────────────────

const inFlight = new Map<string, Promise<HistoryServiceResponse>>();

/**
 * Fetch (and sync) the full history for a wallet address.
 * Concurrent calls for the same address are deduplicated in-process.
 * TODO(multi-instance): replace with pg_try_advisory_xact_lock(hashtext($addr))
 */
export async function getUserHistory(
  address: string,
): Promise<HistoryServiceResponse> {
  const key = getAddress(address); // EIP-55 normalise
  const existing = inFlight.get(key);
  if (existing) return existing;
  const p = _run(key);
  inFlight.set(key, p);
  // Use .then/.catch instead of .finally to avoid a dangling rejected promise
  // that would surface as an unhandled rejection when p rejects.
  p.then(
    () => inFlight.delete(key),
    () => inFlight.delete(key),
  );
  return p;
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(phase: string, data: Record<string, unknown>): void {
  console.log(JSON.stringify({ service: "userHistory", phase, ...data }));
}

// ─── Helpers: market-ID extraction and merge ─────────────────────────────────

function extractTouchedMarkets(delta: UserDeltaResponse): TouchedMarkets {
  return {
    vaultIds: [
      ...new Set([
        ...delta.PraxisVault_Deposit.map((e) => e.vault),
        ...delta.PraxisVault_Withdraw.map((e) => e.vault),
        ...delta.PraxisVault_RedeemYield.map((e) => e.vault),
      ]),
    ],
    rydIds: [
      ...new Set([
        ...delta.PraxisRYD_Deposited.map((e) => e.ryd),
        ...delta.PraxisRYD_Withdrawn.map((e) => e.ryd),
        ...delta.PraxisRYD_PrizeClaimed.map((e) => e.ryd),
      ]),
    ],
    // CPFWithdraw omits poolId on-chain — only PlaceBet/CancelBet/RewardClaimed carry it.
    cpfPoolIds: [
      ...new Set([
        ...delta.PraxisCPF_PlaceBet.map((e) => `${e.cpf}_${e.poolId}`),
        ...delta.PraxisCPF_CancelBet.map((e) => `${e.cpf}_${e.poolId}`),
        ...delta.PraxisCPF_RewardClaimed.map((e) => `${e.cpf}_${e.poolId}`),
      ]),
    ],
    twoPoolIds: [
      ...new Set([
        ...delta.PraxisTwoPool_Deposited.map((e) => e.pool),
        ...delta.PraxisTwoPool_Claimed.map((e) => e.pool),
      ]),
    ],
  };
}

function mergeMarkets(a: TouchedMarkets, b: TouchedMarkets): TouchedMarkets {
  return {
    vaultIds: [...new Set([...a.vaultIds, ...b.vaultIds])],
    rydIds: [...new Set([...a.rydIds, ...b.rydIds])],
    cpfPoolIds: [...new Set([...a.cpfPoolIds, ...b.cpfPoolIds])],
    twoPoolIds: [...new Set([...a.twoPoolIds, ...b.twoPoolIds])],
  };
}

// ─── Shared response builder ──────────────────────────────────────────────────

type DbClient = Pick<typeof db, "userPortfolioPoint">;

/** Most recent N daily points, ascending by date (for chart rendering). */
async function fetchRecentChartPoints(client: DbClient, userAddress: string) {
  const points = await client.userPortfolioPoint.findMany({
    where: { userAddress },
    orderBy: { bucketTs: "desc" },
    take: CHART_WINDOW_DAYS,
  });
  return points.reverse();
}

type ChartRow = Awaited<ReturnType<typeof fetchRecentChartPoints>>[number];

function deserializeActivity(
  a: UserActivity,
  titleContext: ActivityTitleContext,
): ActivityItem {
  const meta = a.metadataJson as Record<string, unknown>;
  const kind = a.kind as ActivityKind;
  return {
    id: a.id,
    kind,
    title: formatActivityTitle(kind, meta, {
      cpfEventTitle: resolveCpfEventTitle(a, titleContext),
      twoPoolName: resolveTwoPoolName(a, titleContext),
    }),
    amount: a.amountDelta,
    time: Number(a.blockTime) * 1000,
    productAddr: a.productAddr,
    marketRef: a.marketRef ?? undefined,
    txMeta: meta,
  };
}

/**
 * Single unified response builder used by both the cache-hit path and the
 * fresh-sync path, eliminating the structural drift between the two.
 */
async function buildHistoryResponse(opts: {
  userAddress: string;
  syncedAtBlock: string;
  envioLatestBlock: string;
  cacheHit: boolean;
  schemaVersion: number;
  portfolio: Pick<PortfolioMemento, "totalValueUsdc" | "breakdown" | "positions">;
  activity: UserActivity[];
  chart: ChartRow[];
  meta: { durationMs: number; blocksProcessed: number; mapperVersion: number };
  stale?: { cachedAt: string; syncedAtBlock: string };
}): Promise<HistoryServiceResponse> {
  const titleContext = await fetchActivityTitleContext(db, opts.activity);

  return {
    userAddress: opts.userAddress,
    syncedAtBlock: opts.syncedAtBlock,
    envioLatestBlock: opts.envioLatestBlock,
    cacheHit: opts.cacheHit,
    schemaVersion: opts.schemaVersion,
    portfolio: {
      totalValueUsdc: opts.portfolio.totalValueUsdc,
      breakdown: opts.portfolio.breakdown,
      positions: opts.portfolio.positions,
    },
    chart: opts.chart.map((p) => ({
      date: p.bucketDate,
      ts: String(p.bucketTs),
      value: p.totalValue,
    })),
    activity: opts.activity.map((a) => deserializeActivity(a, titleContext)),
    meta: opts.meta,
    ...(opts.stale ? { stale: opts.stale } : {}),
  };
}

async function buildCachedResponse(
  cache: UserHistoryCache,
  stale?: { cachedAt: string; syncedAtBlock: string },
): Promise<HistoryServiceResponse> {
  const [activities, chart] = await Promise.all([
    db.userActivity.findMany({
      where: { userAddress: cache.userAddress },
      orderBy: { blockTime: "desc" },
      take: 100,
    }),
    fetchRecentChartPoints(db, cache.userAddress),
  ]);

  return buildHistoryResponse({
    userAddress: cache.userAddress,
    syncedAtBlock: String(cache.lastProcessedBlock),
    envioLatestBlock: String(cache.envioBlockAtSync),
    cacheHit: true,
    schemaVersion: cache.schemaVersion,
    portfolio: deserializePortfolio(cache.portfolioJson),
    activity: activities,
    chart,
    meta: { durationMs: 0, blocksProcessed: 0, mapperVersion: 1 },
    stale,
  });
}

/** Start date of the chart window that step3 checks for stale zeros. */
function historyWindowStart(today: string): string {
  const d = new Date(today + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - CHART_WINDOW_DAYS);
  return d.toISOString().slice(0, 10);
}

// ─── DB activity converter ────────────────────────────────────────────────────

/** Converts a Prisma UserActivity row to the minimal shape `applyEvent` needs. */
function dbRowToActivityForState(a: UserActivity): ActivityForState {
  return {
    kind: a.kind as ActivityKind,
    productAddr: a.productAddr,
    marketRef: a.marketRef,
    amountDelta: a.amountDelta,
    blockTime: a.blockTime,
    metadataJson: a.metadataJson as Record<string, unknown>,
  };
}

// ─── Template Method steps ────────────────────────────────────────────────────

/** Step 1: Load cache row and build the SyncContext for this run. */
async function step1_loadCache(address: string, t0: number): Promise<SyncContext> {
  const cache = await db.userHistoryCache.findUnique({ where: { userAddress: address } });
  const isSchemaStale = !cache || cache.schemaVersion < CURRENT_SCHEMA_VERSION;
  const lastBlock = isSchemaStale ? 0n : cache.lastProcessedBlock;
  const cursor = isSchemaStale ? ZERO_CURSOR : makeEventCursor(lastBlock, 0);
  const cachedMarkets: TouchedMarkets = {
    vaultIds: cache?.touchedVaults ?? [],
    rydIds: cache?.touchedRyds ?? [],
    cpfPoolIds: cache?.touchedCpfPools ?? [],
    twoPoolIds: cache?.touchedTwoPools ?? [],
  };
  return {
    address,
    t0,
    cache,
    isSchemaStale,
    lastBlock,
    cursor,
    cachedMarkets,
    // Discard the memento on schema upgrades so step 9 replays the full history.
    memento: cache && !isSchemaStale ? deserializePortfolio(cache.portfolioJson) : null,
  };
}

/** Step 2: Fetch the Envio chain head. Throws StaleFallbackError if unreachable and cache exists. */
async function step2_fetchEnvioHead(ctx: SyncContext): Promise<number> {
  try {
    return await fetchEnvioHead();
  } catch (err) {
    log("envio-head-error", { address: ctx.address, error: String(err) });
    if (ctx.cache) {
      throw new StaleFallbackError(
        await buildCachedResponse(ctx.cache, {
          cachedAt: ctx.cache.updatedAt.toISOString(),
          syncedAtBlock: String(ctx.cache.lastProcessedBlock),
        }),
      );
    }
    throw err;
  }
}

/**
 * Step 3: Return a cached HistoryServiceResponse if no new blocks need
 * processing, or null to continue into the full sync cycle.
 */
async function step3_checkCacheHit(
  ctx: SyncContext,
  envioHead: number,
): Promise<HistoryServiceResponse | null> {
  const { cache, isSchemaStale, address, memento } = ctx;
  if (!cache || isSchemaStale || envioHead > Number(cache.envioBlockAtSync)) return null;

  const cachedTotal = memento?.totalValueUsdc ?? "0";
  const todayForCheck = toUtcDateBucket(Date.now());
  const staleZeroCount = await db.userPortfolioPoint.count({
    where: {
      userAddress: address,
      totalValue: "0",
      bucketTs: { gte: toBucketTs(historyWindowStart(todayForCheck)) },
    },
  });
  const chartLooksStale = BigInt(cachedTotal) > 0n && staleZeroCount > 0;

  if (chartLooksStale) {
    log("chart-repair", { address, block: envioHead, cachedTotal, staleZeroCount });
    return null;
  }

  log("cache-hit", { address, block: envioHead, durationMs: Date.now() - ctx.t0 });
  return buildCachedResponse(cache);
}

interface EnvioFetchResult {
  userDelta: UserDeltaResponse;
  touchedMarkets: TouchedMarkets;
  derived: UserDerivedStateResponse | null;
  globalState: GlobalStateResponse | null;
}

/**
 * Steps 4–6: Fetch Q1 (user events), derive touched markets, then fire Q2/Q3
 * (derived + global state) in sequence.
 * Throws StaleFallbackError if Envio is unreachable and cache exists.
 */
async function steps4to6_fetchEnvio(ctx: SyncContext): Promise<EnvioFetchResult> {
  const tEnvio = Date.now();
  try {
    const userDelta = await fetchAllUserEvents(ctx.cursor, ctx.address.toLowerCase());
    const touchedMarkets = mergeMarkets(ctx.cachedMarkets, extractTouchedMarkets(userDelta));
    const { derived, global: globalState } = await fetchDerivedAndGlobalState(
      ctx.address.toLowerCase(),
      touchedMarkets,
    );
    log("envio-fetch", { address: ctx.address, durationMs: Date.now() - tEnvio });
    return { userDelta, touchedMarkets, derived, globalState };
  } catch (err) {
    log("envio-fetch-error", { address: ctx.address, error: String(err) });
    if (ctx.cache) {
      throw new StaleFallbackError(
        await buildCachedResponse(ctx.cache, {
          cachedAt: ctx.cache.updatedAt.toISOString(),
          syncedAtBlock: String(ctx.cache.lastProcessedBlock),
        }),
      );
    }
    throw err;
  }
}

/** Step 7: Map raw delta events to typed ActivityRecord rows. */
function step7_mapActivities(userDelta: UserDeltaResponse, address: string) {
  return mapAllDeltaToActivities(userDelta, address);
}

/** Step 8: Recompute portfolio valuation from Envio derived + global state. */
function step8_computePortfolio(
  derived: UserDerivedStateResponse | null,
  globalState: GlobalStateResponse | null,
  address: string,
): ComputedPortfolio {
  const tValuation = Date.now();
  const portfolio = computePortfolio(derived, globalState);
  log("valuation", { address, durationMs: Date.now() - tValuation });
  return portfolio;
}

interface CarryForwardResult {
  fillPoints: PortfolioPointRow[];
  today: string;
  todayTs: bigint;
}

/**
 * Step 9: Build the historical portfolio curve.
 *
 * Replays all stored `UserActivity` rows (plus the new ones from this sync
 * that haven't been written yet) through the `HistoricalUserState` machine,
 * emitting one `PortfolioPointRow` per calendar day in the range
 * (lastBucketDate, yesterday].  Today's point is handled separately by
 * step10_persist using the accurate `portfolio.totalValueUsdc` snapshot.
 *
 * On first-ever sync (`lastBucketDate = null`) the range starts from the
 * day before the earliest on-chain activity.
 */
async function step9_buildHistoricalCurve(
  ctx: SyncContext,
  newActivities: ReturnType<typeof mapAllDeltaToActivities>,
  globalState: GlobalStateResponse | null,
): Promise<CarryForwardResult> {
  const today = toUtcDateBucket(Date.now());
  const todayTs = toBucketTs(today);

  const yesterdayDate = new Date(today + "T00:00:00Z");
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  // ── Build CPF / RYD lookup maps from current global state ─────────────────
  // Key format must match activityMappers.ts marketRef: "${cpf}_${poolId}" (underscore).
  const cpfByMarketRef = new Map<string, RawCPFPoolState>(
    (globalState?.CPFPoolState ?? []).map((s) => [`${s.cpfAddress}_${s.poolId}`, s]),
  );
  const rydById = new Map<string, RawRYDState>(
    (globalState?.RYDState ?? []).map((s) => [s.id, s]),
  );

  // ── Load all existing DB activities, merge with unsaved new ones ───────────
  const dbActivities = await db.userActivity.findMany({
    where: { userAddress: ctx.address },
    orderBy: { blockTime: "asc" },
  });

  const existingIds = new Set(dbActivities.map((a) => a.id));
  const additionalActivities = newActivities.filter((a) => !existingIds.has(a.id));

  const allActivities: ActivityForState[] = [
    ...dbActivities.map(dbRowToActivityForState),
    ...additionalActivities,
  ].sort((a, b) => (a.blockTime < b.blockTime ? -1 : a.blockTime > b.blockTime ? 1 : 0));

  if (allActivities.length === 0) {
    return { fillPoints: [], today, todayTs };
  }

  // ── Determine `from` date ─────────────────────────────────────────────────
  const lastBucketDate = ctx.memento?.lastBucketDate ?? null;

  let from: string;
  if (lastBucketDate) {
    from = lastBucketDate;
  } else {
    const firstEventDate = toUtcDateBucket(Number(allActivities[0].blockTime) * 1000);
    const d = new Date(firstEventDate + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    from = d.toISOString().slice(0, 10);
  }

  // Cap to the chart window — emitting more than CHART_WINDOW_DAYS points gives
  // the DB transaction nothing useful to store and causes it to time out.
  // We still replay ALL events below to get the correct state at the cutoff.
  const windowCutoff = new Date(yesterday + "T00:00:00Z");
  windowCutoff.setUTCDate(windowCutoff.getUTCDate() - (CHART_WINDOW_DAYS - 1));
  const windowCutoffDate = windowCutoff.toISOString().slice(0, 10);
  if (from < windowCutoffDate) {
    from = windowCutoffDate;
  }

  if (from >= yesterday) {
    return { fillPoints: [], today, todayTs };
  }

  // ── Replay ALL events up to end-of-`from` to restore correct state ─────────
  // (includes events before the window cutoff — needed for accurate valuation)
  const fromEndSec = BigInt(Math.floor(new Date(from + "T23:59:59Z").getTime() / 1000));
  const state = makeHistoricalUserState();
  let activityIdx = 0;

  while (activityIdx < allActivities.length && allActivities[activityIdx].blockTime <= fromEndSec) {
    applyEvent(state, allActivities[activityIdx]);
    activityIdx++;
  }

  // ── Walk day by day: (from, yesterday] ────────────────────────────────────
  const fillPoints: PortfolioPointRow[] = [];
  const cursor = new Date(from + "T00:00:00Z");
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  const endDate = new Date(yesterday + "T00:00:00Z");

  while (cursor <= endDate) {
    const bucketDate = cursor.toISOString().slice(0, 10);
    const bucketEndSec = BigInt(Math.floor(new Date(bucketDate + "T23:59:59Z").getTime() / 1000));

    while (
      activityIdx < allActivities.length &&
      allActivities[activityIdx].blockTime <= bucketEndSec
    ) {
      applyEvent(state, allActivities[activityIdx]);
      activityIdx++;
    }

    const totalValue = valuateDay(state, bucketDate, cpfByMarketRef, rydById, state.redeemEvents);

    fillPoints.push({
      bucketDate,
      bucketTs: toBucketTs(bucketDate),
      totalValue: String(totalValue),
      breakdownJson: {},
    });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  log("historical-curve", { address: ctx.address, from, yesterday, points: fillPoints.length });

  return { fillPoints, today, todayTs };
}

interface PersistResult {
  recentActivities: UserActivity[];
  chartPoints: ChartRow[];
}

/** Steps 10–11: Persist activities, chart points, and cache atomically; read back inside the transaction. */
async function step10_persist(
  ctx: SyncContext,
  envioHead: number,
  newActivities: ReturnType<typeof mapAllDeltaToActivities>,
  fillPoints: PortfolioPointRow[],
  portfolio: ComputedPortfolio,
  touchedMarkets: TouchedMarkets,
  today: string,
  todayTs: bigint,
): Promise<PersistResult> {
  const tDb = Date.now();
  const mementoJson = serializePortfolio(portfolio, today);

  const { recentActivities, chartPoints } = await db.$transaction(
    async (tx) => {
      // Activities are immutable once written — createMany + skipDuplicates
      // replaces the N-loop upsert and avoids N round-trips inside the transaction.
      if (newActivities.length > 0) {
        await tx.userActivity.createMany({
          data: newActivities.map((a) => ({
            id: a.id,
            userAddress: a.userAddress,
            kind: a.kind,
            productAddr: a.productAddr,
            marketRef: a.marketRef,
            amountDelta: a.amountDelta,
            blockNumber: a.blockNumber,
            blockTime: a.blockTime,
            metadataJson: a.metadataJson,
          })),
          skipDuplicates: true,
        });
      }

      // Carry-forward rows upsert so corrected portfolio values overwrite stale zeros.
      if (fillPoints.length > 0) {
        await Promise.all(
          fillPoints.map((fp) =>
            tx.userPortfolioPoint.upsert({
              where: {
                userAddress_bucketDate: {
                  userAddress: ctx.address,
                  bucketDate: fp.bucketDate,
                },
              },
              update: {
                totalValue: fp.totalValue,
                breakdownJson: fp.breakdownJson,
              },
              create: {
                id: randomUUID(),
                userAddress: ctx.address,
                bucketDate: fp.bucketDate,
                bucketTs: fp.bucketTs,
                totalValue: fp.totalValue,
                breakdownJson: fp.breakdownJson,
              },
            }),
          ),
        );
      }

      // Upsert today's portfolio point (mutable — updates on each sync).
      await tx.userPortfolioPoint.upsert({
        where: {
          userAddress_bucketDate: { userAddress: ctx.address, bucketDate: today },
        },
        update: {
          totalValue: portfolio.totalValueUsdc,
          breakdownJson: portfolio.breakdown,
        },
        create: {
          id: randomUUID(),
          userAddress: ctx.address,
          bucketDate: today,
          bucketTs: todayTs,
          totalValue: portfolio.totalValueUsdc,
          breakdownJson: portfolio.breakdown,
        },
      });

      // Update (or create) the resumability cache row — this IS the Memento save().
      await tx.userHistoryCache.upsert({
        where: { userAddress: ctx.address },
        update: {
          lastProcessedBlock: BigInt(envioHead),
          envioBlockAtSync: BigInt(envioHead),
          schemaVersion: CURRENT_SCHEMA_VERSION,
          portfolioJson: mementoJson,
          touchedVaults: touchedMarkets.vaultIds,
          touchedRyds: touchedMarkets.rydIds,
          touchedCpfPools: touchedMarkets.cpfPoolIds,
          touchedTwoPools: touchedMarkets.twoPoolIds,
        },
        create: {
          userAddress: ctx.address,
          lastProcessedBlock: BigInt(envioHead),
          envioBlockAtSync: BigInt(envioHead),
          schemaVersion: CURRENT_SCHEMA_VERSION,
          portfolioJson: mementoJson,
          touchedVaults: touchedMarkets.vaultIds,
          touchedRyds: touchedMarkets.rydIds,
          touchedCpfPools: touchedMarkets.cpfPoolIds,
          touchedTwoPools: touchedMarkets.twoPoolIds,
        },
      });

      // Read back inside the transaction for a consistent snapshot.
      const [activities, points] = await Promise.all([
        tx.userActivity.findMany({
          where: { userAddress: ctx.address },
          orderBy: { blockTime: "desc" },
          take: 100,
        }),
        fetchRecentChartPoints(tx, ctx.address),
      ]);

      return { recentActivities: activities, chartPoints: points };
    },
    // Safety net: bulk createMany ops are fast, but read-backs and index work
    // on large datasets can still be slow. 30 s is generous without being infinite.
    { timeout: 30_000 },
  );

  log("db", {
    address: ctx.address,
    durationMs: Date.now() - tDb,
    newActivities: newActivities.length,
    fillPoints: fillPoints.length,
  });

  return { recentActivities, chartPoints };
}

// ─── Template Method orchestrator ────────────────────────────────────────────

async function _run(address: string): Promise<HistoryServiceResponse> {
  const t0 = Date.now();

  const ctx = await step1_loadCache(address, t0);

  try {
    // ── Step 2: Get Envio head ───────────────────────────────────────────────
    const envioHead = await step2_fetchEnvioHead(ctx);

    // ── Step 3: Check for a valid cache hit ──────────────────────────────────
    const cacheHit = await step3_checkCacheHit(ctx, envioHead);
    if (cacheHit) return cacheHit;

    // ── Steps 4–6: Fetch user events, derive touched markets, fetch state ────
    const { userDelta, touchedMarkets, derived, globalState } =
      await steps4to6_fetchEnvio(ctx);

    // ── Step 7: Map events → activity rows ──────────────────────────────────
    const newActivities = step7_mapActivities(userDelta, address);

    // ── Step 8: Recompute portfolio valuation ────────────────────────────────
    const portfolio = step8_computePortfolio(derived, globalState, address);

    // ── Step 9: Build historical portfolio curve ─────────────────────────────
    const { fillPoints, today, todayTs } = await step9_buildHistoricalCurve(
      ctx,
      newActivities,
      globalState,
    );

    // ── Step 10: Persist atomically, read back inside transaction ────────────
    const { recentActivities, chartPoints } = await step10_persist(
      ctx,
      envioHead,
      newActivities,
      fillPoints,
      portfolio,
      touchedMarkets,
      today,
      todayTs,
    );

    const totalMs = Date.now() - t0;
    log("done", { address, durationMs: totalMs, block: envioHead });

    return await buildHistoryResponse({
      userAddress: address,
      syncedAtBlock: String(envioHead),
      envioLatestBlock: String(envioHead),
      cacheHit: false,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      portfolio,
      activity: recentActivities,
      chart: chartPoints,
      meta: {
        durationMs: totalMs,
        blocksProcessed: Number(BigInt(envioHead) - ctx.lastBlock),
        mapperVersion: 1,
      },
    });
  } catch (err) {
    if (err instanceof StaleFallbackError) return err.response;
    throw err;
  }
}
