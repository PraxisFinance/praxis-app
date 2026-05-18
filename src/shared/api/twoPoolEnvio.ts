import { envioQuery, toBigInt } from "@/shared/api/envioClient";
import {
  TWO_POOL_NOT_DEFINED_NUM,
  TWO_POOL_NOT_DEFINED_STR,
} from "@/shared/constants/twoPoolSentinels";
import type { CryptoPredictionStatus } from "@/shared/types/cryptoPrediction";
import type { TwoPool } from "@/shared/types/twoPool";

// ── GraphQL (Envio) ───────────────────────────────────────────────────

export const TWO_POOL_STATE_QUERY = `
  query TwoPoolStates {
    TwoPoolState {
      id
      state
      sideTVLStable
      sideTVLElevated
      subsidyBucketStable
      subsidyBucketElevated
      totalDeposits
      uniqueDepositors
      actualRate
      curveStableOut
      curveElevatedOut
      subsidyStableAtResolve
      subsidyElevatedAtResolve
      sideFinalAllocationStable
      sideFinalAllocationElevated
      totalClaimedYtStable
      totalClaimedYtElevated
      claimCount
      resolvedAt
      lastUpdatedAt
    }
  }
`;

/** Raw row from indexer (BigInt fields as strings). */
export interface RawTwoPoolState {
  id: string;
  state: string;
  sideTVLStable: string;
  sideTVLElevated: string;
  subsidyBucketStable: string;
  subsidyBucketElevated: string;
  totalDeposits: number;
  uniqueDepositors: number;
  actualRate: string;
  curveStableOut: string;
  curveElevatedOut: string;
  subsidyStableAtResolve: string;
  subsidyElevatedAtResolve: string;
  sideFinalAllocationStable: string;
  sideFinalAllocationElevated: string;
  totalClaimedYtStable: string;
  totalClaimedYtElevated: string;
  claimCount: number;
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
 * **Cannot be derived from `TwoPoolState` alone** (no matching fields on this type):
 * - **Market copy & branding**: `title`, `assetSymbol`, `iconUrl` — not on indexer; set to
 *   `TWO_POOL_NOT_DEFINED_STR` (UI may substitute a fallback icon URL for display).
 * - **Product economics used for fee-row vs target**: `targetApyPercent` and `predictedApyPercent`
 *   — not on `TwoPoolState`. `actualRate` exists but is an on-chain rate scalar, **not** the same
 *   semantics as “deploy target APY” vs “model predicted APY”, so we do **not** map it into those.
 * - **Quoted entrance fee % of deposit (per side)** — not on `TwoPoolState`. `TwoPoolUser` has
 *   per-wallet `stableFees` / `elevatedFees` vs gross deposits, but there is **no pool-level fee
 *   schedule** on this entity — mapped to `TWO_POOL_NOT_DEFINED_NUM` (-1) in the UI model.
 *
 * **Partially derived / assumptions**:
 * - **`stablePoolPercent` / `elevatedPoolPercent`**: from `sideTVLStable` / `sideTVLElevated` TVL split.
 * - **`endsAt`**: if `resolvedAt` > 0, use that as period end; else use `lastUpdatedAt` (there is
 *   no dedicated “maturity” field on `TwoPoolState`).
 */
export function mapRawTwoPoolStateToTwoPool(raw: RawTwoPoolState): TwoPool {
  console.log("raw", raw);
  const stableTvl = toBigInt(raw.sideTVLStable);
  const elevatedTvl = toBigInt(raw.sideTVLElevated);
  const { stable: stablePoolPercent, elevated: elevatedPoolPercent } = tvlSplitPercents(
    stableTvl,
    elevatedTvl
  );

  const resolvedAt = toBigInt(raw.resolvedAt);
  const endsAt =
    resolvedAt > BigInt(0)
      ? secondsBigIntToIso(raw.resolvedAt)
      : secondsBigIntToIso(raw.lastUpdatedAt);

  const status = mapStateStringToStatus(raw.state, resolvedAt);
  const isTradingOpen = isTradingOpenFromState(raw.state, resolvedAt);

  const gaps = [
    'TwoPoolState has no title, assetSymbol, or iconUrl — UI fields use "Not defined" (icon display falls back to a default asset).',
    "TwoPoolState has no targetApyPercent or predictedApyPercent — UI uses -1; fee row vs target cannot be computed from this entity (actualRate is not a substitute).",
    "TwoPoolState has no pool-level stable/elevated entrance fee % — UI uses -1 until a schedule exists on-chain or in metadata.",
    "TwoPoolState has no explicit trading-end / maturity timestamp — endsAt uses resolvedAt when set, otherwise lastUpdatedAt.",
  ] as const;

  const actualRateTrimmed = raw.actualRate?.trim() ?? "";
  const actualRateRaw =
    actualRateTrimmed.length > 0 && actualRateTrimmed !== "0"
      ? raw.actualRate
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
    targetApyPercent: TWO_POOL_NOT_DEFINED_NUM,
    predictedApyPercent: TWO_POOL_NOT_DEFINED_NUM,
    stablePoolPercent,
    elevatedPoolPercent,
    stableEntranceFeePercent: TWO_POOL_NOT_DEFINED_NUM,
    elevatedEntranceFeePercent: TWO_POOL_NOT_DEFINED_NUM,
    actualRateRaw,
    indexerGaps: gaps,
  };
}

export async function fetchTwoPoolStates(): Promise<TwoPool[]> {
  const data = await envioQuery<{ TwoPoolState: RawTwoPoolState[] }>(TWO_POOL_STATE_QUERY);
  const rows = data.TwoPoolState ?? [];
  return rows.map(mapRawTwoPoolStateToTwoPool);
}
