import type { CPFPoolState } from "@/stores/eventsStore";
import type {
  CryptoBinaryOutcome,
  CryptoPrediction,
  CryptoPredictionStatus,
} from "@/shared/types/cryptoPrediction";
import type { OffchainEventData } from "@/lib/trpc/routers/offchainEvents";
import { outcomeLabelsFromResolutionTypeTuple } from "@/shared/constants/resolutionTypeTuples";

function poolPercents(stakeInFavor: bigint, stakeAgainst: bigint): [number, number] {
  const total = stakeInFavor + stakeAgainst;
  if (total === BigInt(0)) return [50, 50];
  const favor = Math.round((Number(stakeInFavor) * 100) / Number(total));
  return [favor, 100 - favor];
}

function impliedOdds(percent: number): number {
  if (percent <= 0) return 99;
  return Math.round((100 / percent) * 100) / 100;
}

/**
 * Offchain timestamps are usually Unix seconds (Prisma `Float`).
 * Values above ~1e10 are treated as milliseconds (JS-style) so either unit works.
 */
function epochSecondsToMs(v: number | null | undefined): number | null {
  if (v == null || !Number.isFinite(v) || v <= 0) return null;
  if (v > 10_000_000_000) return Math.round(v);
  return v * 1000;
}

function deriveStatus(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number = Date.now()
): CryptoPredictionStatus {
  const voteMs = epochSecondsToMs(offchain?.votingDeadlineTs);
  const expMs = epochSecondsToMs(offchain?.expirationTimestamp);

  switch (pool.state) {
    case "Resolved": {
      const endedAt =
        pool.resolvedAt > BigInt(0)
          ? new Date(Number(pool.resolvedAt) * 1000).toISOString()
          : undefined;
      return {
        kind: "ended",
        resolutionSummary: pool.winningOutcome ? `Resolved: ${pool.winningOutcome}` : "Resolved",
        endedAt,
      };
    }
    case "Canceled":
      return { kind: "ended", resolutionSummary: "Canceled" };
    case "Voided":
      return { kind: "ended", resolutionSummary: "Voided" };
    case "Locked":
      return { kind: "locked" };
    case "Open": {
      if (voteMs != null && expMs != null && voteMs < expMs) {
        if (nowMs < voteMs) return { kind: "live" };
        if (nowMs < expMs) return { kind: "locked" };
        return { kind: "resolving" };
      }
      if (expMs != null && nowMs >= expMs) {
        return { kind: "resolving" };
      }
      if (voteMs != null && expMs == null && nowMs >= voteMs) {
        return { kind: "locked" };
      }
      return { kind: "live" };
    }
  }
}

function deriveIsTradingOpen(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (pool.state !== "Open") return false;
  const voteMs = epochSecondsToMs(offchain?.votingDeadlineTs);
  const expMs = epochSecondsToMs(offchain?.expirationTimestamp);
  if (voteMs != null) return nowMs < voteMs;
  if (expMs != null) return nowMs < expMs;
  return true;
}

function deriveEndsAt(pool: CPFPoolState, offchain?: OffchainEventData | null): string {
  const expMs = epochSecondsToMs(offchain?.expirationTimestamp);
  if (expMs != null) {
    return new Date(expMs).toISOString();
  }
  if (pool.resolvedAt > BigInt(0)) {
    return new Date(Number(pool.resolvedAt) * 1000).toISOString();
  }
  if (pool.createdAt > BigInt(0)) {
    return new Date(Number(pool.createdAt) * 1000).toISOString();
  }
  return new Date().toISOString();
}

/** Match indexer pool → offchain row (`contractEventId` may equal `poolId` or `conditionId`). */
export function resolveOffchainDataForPool(
  pool: CPFPoolState,
  offchainByContractId: Record<string, OffchainEventData | undefined>
): OffchainEventData | null {
  const keys = [String(pool.poolId), pool.conditionId, pool.conditionId?.toLowerCase()].filter(
    (k): k is string => typeof k === "string" && k.length > 0
  );
  for (const k of keys) {
    const hit = offchainByContractId[k];
    if (hit) return hit;
  }
  return null;
}

export function mapCPFPoolToCryptoPrediction(
  pool: CPFPoolState,
  offchain?: OffchainEventData | null,
  nowMs: number = Date.now()
): CryptoPrediction {
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);

  const tupleLabels = outcomeLabelsFromResolutionTypeTuple(offchain?.resolutionTypeTuple);
  const favorLabel = tupleLabels?.inFavor ?? "Yes";
  const againstLabel = tupleLabels?.against ?? "No";

  const outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome] = [
    {
      id: "in_favor",
      label: favorLabel,
      odds: impliedOdds(favorPercent),
      poolPercent: favorPercent,
    },
    {
      id: "against",
      label: againstLabel,
      odds: impliedOdds(againstPercent),
      poolPercent: againstPercent,
    },
  ];

  return {
    id: pool.id,
    cpfPoolId: pool.poolId,
    cpfAddress: pool.cpfAddress as `0x${string}`,
    title: offchain?.title ?? `Pool #${pool.poolId}`,
    description: offchain?.description,
    categories: offchain?.categories,
    assetSymbol: "",
    iconUrl: offchain?.logoPath ?? "",
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    predictionType: "crypto_up_down",
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    outcomes,
  };
}

export function mapCPFPoolsToCryptoPredictions(
  pools: CPFPoolState[],
  offchainByContractId: Record<string, OffchainEventData | undefined> = {},
  nowMs: number = Date.now()
): CryptoPrediction[] {
  return pools.map((pool) =>
    mapCPFPoolToCryptoPrediction(
      pool,
      resolveOffchainDataForPool(pool, offchainByContractId),
      nowMs
    )
  );
}
