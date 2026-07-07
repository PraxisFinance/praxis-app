import type { CPFPoolState } from "@/stores/eventsStore";
import type {
  CryptoBinaryOutcome,
  CryptoPrediction,
  CryptoPredictionStatus,
} from "@/shared/types/cryptoPrediction";
import type { EsportsPredictionCard } from "@/shared/types/esportsMatch";
import type { FinancePredictionCard } from "@/shared/types/financeHubEvent";
import { buildFinanceHubTitle } from "@/shared/types/financeHubEvent";
import type { PredictionsHubListItem } from "@/shared/types/predictionsHubItem";
import type { EsportsGameFilterId } from "@/shared/constants/esports";
import type { OffchainEventData } from "@/lib/trpc/routers/offchainEvents";
import type { SportPredictionCard } from "@/shared/types/predictions/domains/sport";
import type { PoliticsPredictionCard } from "@/shared/types/predictions/domains/politics";
import type { TechPredictionCard } from "@/shared/types/predictions/domains/tech";
import type { PredictionsHubSportDisciplineId } from "@/shared/constants/predictionsHubFilters";
import { outcomeLabelsFromResolutionTypeTuple } from "@/shared/constants/resolutionTypeTuples";
import { USDC_DECIMALS } from "@/shared/constants/tokens";

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

/** Formats total stake as a compact volume label, e.g. "$858.74K Vol." */
function formatVolumeLabel(total: bigint, decimals = USDC_DECIMALS): string | undefined {
  if (total === BigInt(0)) return undefined;
  const usd = Number(total) / 10 ** decimals;
  let compact: string;
  if (usd >= 1_000_000) {
    compact = `$${(usd / 1_000_000).toFixed(2)}M`;
  } else if (usd >= 1_000) {
    compact = `$${(usd / 1_000).toFixed(2)}K`;
  } else {
    compact = `$${usd.toFixed(2)}`;
  }
  return `${compact} Vol.`;
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

// ── Per-category mappers ─────────────────────────────────────────────

function mapCPFPoolToEsportsCard(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number
): EsportsPredictionCard {
  const meta = offchain?.metadata;
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);

  const VALID_GAME_IDS: readonly EsportsGameFilterId[] = [
    "dota2",
    "csgo",
    "lol",
    "valorant",
    "cod",
  ];
  const rawGameId = meta?.gameId;
  const gameId: EsportsGameFilterId =
    rawGameId != null && (VALID_GAME_IDS as readonly string[]).includes(rawGameId)
      ? rawGameId
      : "dota2";

  const externalMatchId = offchain?.sourceId ?? undefined;

  return {
    id: pool.id,
    predictionType: "esports",
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    streamUrl: meta?.streamUrl,
    gameId,
    externalMatchId,
    participantA: {
      name: meta?.teamAName ?? "Team A",
      logoUrl: meta?.teamALogoUrl ?? "",
      odds: impliedOdds(favorPercent),
    },
    participantB: {
      name: meta?.teamBName ?? "Team B",
      logoUrl: meta?.teamBLogoUrl ?? "",
      odds: impliedOdds(againstPercent),
    },
  };
}

function mapCPFPoolToFinanceCard(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number
): FinancePredictionCard {
  const meta = offchain?.metadata;
  const assetName = meta?.assetName ?? offchain?.title ?? "";
  const assetTicker = meta?.assetTicker ?? "";
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);

  const sideALabel = offchain?.sideALabel ?? "Up";
  const sideBLabel = offchain?.sideBLabel ?? "Down";

  return {
    id: pool.id,
    predictionType: "finance",
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    title: offchain?.title ?? buildFinanceHubTitle(assetName, assetTicker),
    imageUrl: offchain?.logoPath ?? "",
    description: offchain?.description,
    categories: offchain?.categories,
    volumeLabel: formatVolumeLabel(pool.stakeInFavor + pool.stakeAgainst),
    assetName,
    assetTicker,
    outcomes: [
      { id: "in_favor", label: sideALabel, odds: impliedOdds(favorPercent), poolPercent: favorPercent },
      { id: "against", label: sideBLabel, odds: impliedOdds(againstPercent), poolPercent: againstPercent },
    ],
  };
}

function mapCPFPoolToSportCard(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number
): SportPredictionCard {
  const meta = offchain?.metadata;
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);

  const VALID_DISCIPLINE_IDS: readonly PredictionsHubSportDisciplineId[] = [
    "football",
    "basketball",
    "hockey",
    "formula1",
  ];
  const rawDisciplineId = meta?.disciplineId;
  const disciplineId: PredictionsHubSportDisciplineId =
    rawDisciplineId != null && (VALID_DISCIPLINE_IDS as readonly string[]).includes(rawDisciplineId)
      ? rawDisciplineId
      : "football";

  return {
    id: pool.id,
    predictionType: "sport",
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    streamUrl: meta?.streamUrl,
    disciplineId,
    externalMatchId: offchain?.sourceId ?? undefined,
    participantA: {
      name: meta?.teamAName ?? "Team A",
      logoUrl: meta?.teamALogoUrl ?? "",
      odds: impliedOdds(favorPercent),
    },
    participantB: {
      name: meta?.teamBName ?? "Team B",
      logoUrl: meta?.teamBLogoUrl ?? "",
      odds: impliedOdds(againstPercent),
    },
  };
}

function mapCPFPoolToPoliticsCard(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number
): PoliticsPredictionCard {
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);
  const sideALabel = offchain?.sideALabel ?? "Yes";
  const sideBLabel = offchain?.sideBLabel ?? "No";

  return {
    id: pool.id,
    predictionType: "politics",
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    title: offchain?.title ?? "",
    imageUrl: offchain?.logoPath ?? "",
    description: offchain?.description,
    categories: offchain?.categories,
    volumeLabel: formatVolumeLabel(pool.stakeInFavor + pool.stakeAgainst),
    outcomes: [
      { id: "in_favor", label: sideALabel, odds: impliedOdds(favorPercent), poolPercent: favorPercent },
      { id: "against", label: sideBLabel, odds: impliedOdds(againstPercent), poolPercent: againstPercent },
    ],
  };
}

function mapCPFPoolToTechCard(
  pool: CPFPoolState,
  offchain: OffchainEventData | null | undefined,
  nowMs: number
): TechPredictionCard {
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);
  const sideALabel = offchain?.sideALabel ?? "Yes";
  const sideBLabel = offchain?.sideBLabel ?? "No";

  return {
    id: pool.id,
    predictionType: "tech",
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    title: offchain?.title ?? "",
    imageUrl: offchain?.logoPath ?? "",
    description: offchain?.description,
    categories: offchain?.categories,
    volumeLabel: formatVolumeLabel(pool.stakeInFavor + pool.stakeAgainst),
    outcomes: [
      { id: "in_favor", label: sideALabel, odds: impliedOdds(favorPercent), poolPercent: favorPercent },
      { id: "against", label: sideBLabel, odds: impliedOdds(againstPercent), poolPercent: againstPercent },
    ],
  };
}

export function mapCPFPoolToCryptoPrediction(
  pool: CPFPoolState,
  offchain?: OffchainEventData | null,
  nowMs: number = Date.now()
): CryptoPrediction {
  const [favorPercent, againstPercent] = poolPercents(pool.stakeInFavor, pool.stakeAgainst);

  const tupleLabels = outcomeLabelsFromResolutionTypeTuple(offchain?.resolutionTypeTuple);
  const favorLabel = tupleLabels?.inFavor ?? offchain?.sideALabel ?? "Yes";
  const againstLabel = tupleLabels?.against ?? offchain?.sideBLabel ?? "No";

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
    assetSymbol: offchain?.metadata?.assetSymbol ?? "",
    iconUrl: offchain?.logoPath ?? "",
    volumeLabel: formatVolumeLabel(pool.stakeInFavor + pool.stakeAgainst),
    status: deriveStatus(pool, offchain, nowMs),
    endsAt: deriveEndsAt(pool, offchain),
    predictionType: "crypto_up_down",
    isTradingOpen: deriveIsTradingOpen(pool, offchain, nowMs),
    outcomes,
  };
}

/**
 * Dispatches a CPF pool to the correct hub card type based on `offchain.category`.
 * - `"esports"` → `EsportsPredictionCard`
 * - `"sport"`   → `SportPredictionCard`
 * - `"politics"` → `PoliticsPredictionCard`
 * - `"tech"`    → `TechPredictionCard`
 * - `"finance"` → `FinancePredictionCard`
 * - everything else → `CryptoPrediction` (`crypto_up_down`)
 */
export function mapCPFPoolToHubCard(
  pool: CPFPoolState,
  offchain?: OffchainEventData | null,
  nowMs: number = Date.now()
): PredictionsHubListItem {
  const category = offchain?.category ?? null;

  if (category === "esports") return mapCPFPoolToEsportsCard(pool, offchain, nowMs);
  if (category === "sport") return mapCPFPoolToSportCard(pool, offchain, nowMs);
  if (category === "politics") return mapCPFPoolToPoliticsCard(pool, offchain, nowMs);
  if (category === "tech") return mapCPFPoolToTechCard(pool, offchain, nowMs);
  if (category === "finance") return mapCPFPoolToFinanceCard(pool, offchain, nowMs);
  return mapCPFPoolToCryptoPrediction(pool, offchain, nowMs);
}

/** Maps a batch of CPF pools to typed hub cards, resolving offchain metadata for each. */
export function mapCPFPoolsToHubCards(
  pools: CPFPoolState[],
  offchainByContractId: Record<string, OffchainEventData | undefined> = {},
  nowMs: number = Date.now()
): PredictionsHubListItem[] {
  return pools.map((pool) =>
    mapCPFPoolToHubCard(pool, resolveOffchainDataForPool(pool, offchainByContractId), nowMs)
  );
}

/** @deprecated Use `mapCPFPoolsToHubCards`. */
export function mapCPFPoolsToCryptoPredictions(
  pools: CPFPoolState[],
  offchainByContractId: Record<string, OffchainEventData | undefined> = {},
  nowMs: number = Date.now()
): CryptoPrediction[] {
  return pools
    .map((pool) =>
      mapCPFPoolToCryptoPrediction(
        pool,
        resolveOffchainDataForPool(pool, offchainByContractId),
        nowMs
      )
    );
}
