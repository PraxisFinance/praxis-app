import { envioQuery, toBigInt } from "@/shared/api/envioClient";
import { TOKEN_DECIMALS } from "@/config/tokens";
import {
  TWO_POOL_NOT_DEFINED_NUM,
  TWO_POOL_NOT_DEFINED_STR,
} from "@/shared/constants/twoPoolSentinels";
import type { CryptoPredictionStatus } from "@/shared/types/cryptoPrediction";
import type { TwoPool } from "@/shared/types/twoPool";
import { formatTokenBalance } from "@/shared/utils/format";

/** Matches on-chain `RATE_SCALE` (1e18 = 100%). */
const RATE_SCALE = 1_000_000_000_000_000_000n;
/** Matches on-chain `FEE_DENOMINATOR` (10_000 = 100%). */
const FEE_DENOMINATOR = 10_000n;

// ── GraphQL (Envio) ───────────────────────────────────────────────────

export const TWO_POOL_STATE_QUERY = `
  query TwoPoolStates {
    TwoPoolState {
      id
      state
      stableReserve
      elevatedReserve
      targetRate
      buffer
      feePercentage
      stablePrice
      actualRate
      startTime
      endTime
      resolvedAt
      lastUpdatedAt
    }
  }
`;

/** Raw row from indexer (BigInt fields as strings). */
export interface RawTwoPoolState {
  id: string;
  state: string;
  stableReserve: string;
  elevatedReserve: string;
  targetRate: string;
  buffer: string;
  feePercentage: string;
  stablePrice: string;
  actualRate: string;
  startTime: string;
  endTime: string;
  resolvedAt: string;
  lastUpdatedAt: string;
}

function secondsBigIntToIso(seconds: string): string {
  const s = toBigInt(seconds);
  if (s <= BigInt(0)) return new Date(0).toISOString();
  return new Date(Number(s) * 1000).toISOString();
}

function tvlSplitPercents(
  stableTvl: bigint,
  elevatedTvl: bigint
): { stable: number; elevated: number } {
  const total = stableTvl + elevatedTvl;
  if (total <= BigInt(0)) return { stable: 50, elevated: 50 };
  const stable = (Number(stableTvl) / Number(total)) * 100;
  const elevated = 100 - stable;
  return {
    stable: Math.round(stable * 100) / 100,
    elevated: Math.round(elevated * 100) / 100,
  };
}

/** Convert 1e18-scaled rate to APY percent (1e18 → 100). */
function wadRateToPercent(wad: bigint): number {
  if (wad <= BigInt(0)) return TWO_POOL_NOT_DEFINED_NUM;
  // Keep 2 decimal places of percent: (wad * 10000) / 1e18 → percent*100
  const scaled = (wad * 10_000n) / RATE_SCALE;
  return Number(scaled) / 100;
}

/** Convert BPS fee (`FEE_DENOMINATOR = 10_000`) to percent. */
function bpsFeeToPercent(bps: bigint): number {
  if (bps < BigInt(0)) return TWO_POOL_NOT_DEFINED_NUM;
  const scaled = (bps * 10_000n) / FEE_DENOMINATOR;
  return Number(scaled) / 100;
}

/**
 * Port of on-chain `marketImpliedAPY()` using indexer `stablePrice`, `targetRate`, `buffer`.
 * Returns APY percent, or `TWO_POOL_NOT_DEFINED_NUM` when undefined.
 */
function marketImpliedApyPercent(
  stablePrice: bigint,
  targetRate: bigint,
  buffer: bigint
): number {
  if (stablePrice <= BigInt(0) || targetRate <= BigInt(0)) return TWO_POOL_NOT_DEFINED_NUM;

  const a = buffer >= targetRate ? 0n : targetRate - buffer;
  if (a === 0n) return TWO_POOL_NOT_DEFINED_NUM;

  const pA = (targetRate * RATE_SCALE) / (2n * a);

  let impliedWad: bigint;
  if (stablePrice >= pA) {
    const denom = RATE_SCALE - pA;
    if (denom === 0n) return TWO_POOL_NOT_DEFINED_NUM;
    impliedWad = (a * (RATE_SCALE - stablePrice)) / denom;
  } else {
    impliedWad = (targetRate * RATE_SCALE) / (2n * stablePrice);
  }

  return wadRateToPercent(impliedWad);
}

function mapStateStringToStatus(state: string, resolvedAt: bigint): CryptoPredictionStatus {
  const label = state.trim() || "Pool";
  const upper = state.toUpperCase();

  if (resolvedAt > BigInt(0) || upper === "RESOLVED" || upper === "CLOSED" || upper === "SETTLED") {
    return {
      kind: "ended",
      resolutionSummary: label,
      endedAt: resolvedAt > BigInt(0) ? secondsBigIntToIso(resolvedAt.toString()) : undefined,
    };
  }

  if (upper === "UPCOMING" || upper === "PENDING" || upper === "SCHEDULED") {
    return { kind: "upcoming", label };
  }

  return { kind: "live", label };
}

function isTradingOpenFromState(state: string, resolvedAt: bigint): boolean {
  const upper = state.toUpperCase();
  if (resolvedAt > BigInt(0)) return false;
  if (upper === "RESOLVED" || upper === "CLOSED" || upper === "SETTLED" || upper === "PAUSED")
    return false;
  return true;
}

/**
 * Maps `TwoPoolState` → UI `TwoPool`.
 *
 * **Cannot be derived from `TwoPoolState` alone**:
 * - **Market copy & branding**: `title`, `assetSymbol`, `iconUrl` — not on indexer; set from
 *   off-chain `TwoPoolContract` in the store (or sentinels until then).
 *
 * **Derived from current indexer schema**:
 * - **`stablePoolPercent` / `elevatedPoolPercent`**: `stableReserve` / `elevatedReserve` TVL split.
 * - **`endsAt`**: `endTime` (campaign maturity).
 * - **`targetApyPercent`**: `targetRate` (1e18 = 100%).
 * - **`predictedApyPercent`**: on-chain `marketImpliedAPY` from `stablePrice` + `targetRate` + `buffer`.
 * - **Entrance fee %**: pool-level `feePercentage` (BPS / 10_000) applied to both sides.
 * - **`actualRateRaw`**: `actualRate` converted to percent string when set (else sentinel).
 */
export function mapRawTwoPoolStateToTwoPool(raw: RawTwoPoolState): TwoPool {
  const stableTvl = toBigInt(raw.stableReserve);
  const elevatedTvl = toBigInt(raw.elevatedReserve);
  const { stable: stablePoolPercent, elevated: elevatedPoolPercent } = tvlSplitPercents(
    stableTvl,
    elevatedTvl
  );

  const resolvedAt = toBigInt(raw.resolvedAt);
  const endTime = toBigInt(raw.endTime);
  const endsAt =
    endTime > BigInt(0)
      ? secondsBigIntToIso(raw.endTime)
      : resolvedAt > BigInt(0)
        ? secondsBigIntToIso(raw.resolvedAt)
        : secondsBigIntToIso(raw.lastUpdatedAt);

  const status = mapStateStringToStatus(raw.state, resolvedAt);
  const isTradingOpen = isTradingOpenFromState(raw.state, resolvedAt);

  const targetRate = toBigInt(raw.targetRate);
  const buffer = toBigInt(raw.buffer);
  const stablePrice = toBigInt(raw.stablePrice);
  const actualRate = toBigInt(raw.actualRate);
  const feeBps = toBigInt(raw.feePercentage);

  const targetApyPercent = wadRateToPercent(targetRate);
  const predictedApyPercent = marketImpliedApyPercent(stablePrice, targetRate, buffer);
  const entranceFeePercent = bpsFeeToPercent(feeBps);

  const gaps = [
    'TwoPoolState has no title, assetSymbol, or iconUrl — UI fields use "Not defined" until TwoPoolContract off-chain data is merged.',
  ] as const;

  const actualRatePercent = wadRateToPercent(actualRate);
  const actualRateRaw =
    actualRatePercent === TWO_POOL_NOT_DEFINED_NUM
      ? TWO_POOL_NOT_DEFINED_STR
      : String(actualRatePercent);

  const totalTvl = stableTvl + elevatedTvl;
  const tvlLabel =
    totalTvl > BigInt(0)
      ? `$${formatTokenBalance(totalTvl, TOKEN_DECIMALS.USDC)}`
      : TWO_POOL_NOT_DEFINED_STR;

  return {
    id: raw.id,
    title: TWO_POOL_NOT_DEFINED_STR,
    assetSymbol: TWO_POOL_NOT_DEFINED_STR,
    iconUrl: "/not-defined.png",
    description: null,
    status,
    endsAt,
    isTradingOpen,
    tvlLabel,
    targetApyPercent,
    predictedApyPercent,
    stablePoolPercent,
    elevatedPoolPercent,
    stableEntranceFeePercent: entranceFeePercent,
    elevatedEntranceFeePercent: entranceFeePercent,
    actualRateRaw,
    indexerGaps: gaps,
  };
}

export async function fetchTwoPoolStates(): Promise<TwoPool[]> {
  const data = await envioQuery<{ TwoPoolState: RawTwoPoolState[] }>(TWO_POOL_STATE_QUERY);
  const rows = data.TwoPoolState ?? [];
  return rows.map(mapRawTwoPoolStateToTwoPool);
}
