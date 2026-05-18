"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CryptoPredictionTimeFilterId,
  CryptoPredictionTypeFilterId,
} from "@/shared/constants/cryptocurrencyPredictions";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { mapCPFPoolsToCryptoPredictions } from "@/shared/utils/cpfPoolMapper";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import { useEventsStore } from "@/stores/eventsStore";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";
import { useActiveVault } from "@/stores/activeVaultStore";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CryptocurrencyFilters } from "./CryptocurrencyFilters";
import { CryptoPredictionDrawer } from "./CryptoPredictionDrawer";
import { CryptocurrencyPredictionCard } from "./CryptocurrencyPredictionCard";
import { TwoPoolCard } from "./TwoPool/TwoPoolCard";
import { TwoPoolDrawer } from "./TwoPool/TwoPoolDrawer";

export type FeedItem =
  | { kind: "crypto"; prediction: CryptoPrediction }
  | { kind: "twoPool"; pool: TwoPool };

function endsAtMs(item: FeedItem): number {
  return new Date(item.kind === "crypto" ? item.prediction.endsAt : item.pool.endsAt).getTime();
}

function buildMergedFeed(
  predictions: CryptoPrediction[],
  twoPools: TwoPool[],
  twoPoolsFirst: boolean
): FeedItem[] {
  const items: FeedItem[] = [
    ...predictions.map((prediction) => ({ kind: "crypto" as const, prediction })),
    ...twoPools.map((pool) => ({ kind: "twoPool" as const, pool })),
  ];
  items.sort((a, b) => {
    if (twoPoolsFirst) {
      const aTp = a.kind === "twoPool";
      const bTp = b.kind === "twoPool";
      if (aTp !== bTp) return aTp ? -1 : 1;
    }
    return endsAtMs(a) - endsAtMs(b);
  });
  return items;
}

function matchesTypeFilter(item: FeedItem, typeId: CryptoPredictionTypeFilterId): boolean {
  if (typeId === "all") return true;
  if (item.kind === "twoPool") return typeId === "two_pool";
  return item.prediction.predictionType === typeId;
}

const TIME_FILTER_MS: Record<CryptoPredictionTimeFilterId, number | null> = {
  all: null,
  live: null, // handled separately
  "1h": 60 * 60_000,
  "6h": 6 * 60 * 60_000,
  "12h": 12 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  "2d": 2 * 24 * 60 * 60_000,
  "1w": 7 * 24 * 60 * 60_000,
};

function matchesTimeFilter(
  item: FeedItem,
  timeId: CryptoPredictionTimeFilterId,
  nowMs: number
): boolean {
  if (timeId === "all") return true;
  const end = endsAtMs(item);
  if (timeId === "live") return end > nowMs;
  const windowMs = TIME_FILTER_MS[timeId];
  if (windowMs === null) return true;
  return end > nowMs && end <= nowMs + windowMs;
}

export interface PredictionsFeedProps {
  sectionTitle: string;
  /** When true (Cryptocurrencies tab), Two-Pool cards are listed before other prediction cards. */
  twoPoolsFirst?: boolean;
}

export function PredictionsFeed({ sectionTitle, twoPoolsFirst = true }: PredictionsFeedProps) {
  const { vaultId, yt } = useActiveVault();
  const cpfPools = useEventsStore((s) => s.pools);
  const cpfLoading = useEventsStore((s) => s.loading);
  const cpfError = useEventsStore((s) => s.error);
  const fetchAllPoolStates = useEventsStore((s) => s.fetchAllPoolStates);
  const offchainByContractId = useEventsStore((s) => s.offchainByContractId);

  const twoPools = useTwoPoolsStore((s) => s.pools);
  const twoPoolsLoading = useTwoPoolsStore((s) => s.loading);
  const twoPoolsError = useTwoPoolsStore((s) => s.error);
  const fetchTwoPools = useTwoPoolsStore((s) => s.fetchPools);

  useEffect(() => {
    if (!vaultId) return;
    void fetchAllPoolStates(vaultId, yt);
    void fetchTwoPools();
  }, [fetchAllPoolStates, fetchTwoPools, vaultId, yt]);

  const poolStates = useMemo(
    () =>
      Object.values(cpfPools)
        .map((p) => p.state)
        .filter((s) => s !== null),
    [cpfPools]
  );

  /** Wall clock for time-based status (memo cannot call `Date.now()`; state updates on an interval). */
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const predictions = useMemo(
    () => mapCPFPoolsToCryptoPredictions(poolStates, offchainByContractId, nowMs),
    [poolStates, offchainByContractId, nowMs]
  );

  const [timeFilter, setTimeFilter] = useState<CryptoPredictionTimeFilterId>("all");
  const [typeFilter, setTypeFilter] = useState<CryptoPredictionTypeFilterId>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPrediction, setDrawerPrediction] = useState<CryptoPrediction | null>(null);
  const [drawerOutcomeId, setDrawerOutcomeId] = useState<string | null>(null);

  const [twoPoolDrawerOpen, setTwoPoolDrawerOpen] = useState(false);
  const [twoPoolDrawerPool, setTwoPoolDrawerPool] = useState<TwoPool | null>(null);
  const [twoPoolDrawerSide, setTwoPoolDrawerSide] = useState<TwoPoolSide | null>(null);

  const merged = useMemo(
    () => buildMergedFeed(predictions, twoPools, twoPoolsFirst),
    [predictions, twoPools, twoPoolsFirst]
  );
  const visible = useMemo(
    () =>
      merged.filter(
        (item) =>
          matchesTypeFilter(item, typeFilter) &&
          matchesTimeFilter(item, timeFilter, nowMs)
      ),
    [merged, typeFilter, timeFilter, nowMs]
  );

  const handleCryptoDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setDrawerPrediction(null);
      setDrawerOutcomeId(null);
    }
  };

  const handlePickBinaryOutcome = (prediction: CryptoPrediction, outcomeId: string) => {
    if (prediction.predictionType === "above_below") return;
    setDrawerPrediction(prediction);
    setDrawerOutcomeId(outcomeId);
    setDrawerOpen(true);
  };

  const handleTwoPoolDrawerOpenChange = (open: boolean) => {
    setTwoPoolDrawerOpen(open);
    if (!open) {
      setTwoPoolDrawerPool(null);
      setTwoPoolDrawerSide(null);
    }
  };

  const handleJoinTwoPool = (pool: TwoPool, side: TwoPoolSide) => {
    setTwoPoolDrawerPool(pool);
    setTwoPoolDrawerSide(side);
    setTwoPoolDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <CryptocurrencyFilters
        timeId={timeFilter}
        onTimeChange={setTimeFilter}
        typeId={typeFilter}
        onTypeChange={setTypeFilter}
      />
      {cpfError ? (
        <p className="text-main-red text-sm leading-snug" role="alert">
          Predictions indexer: {cpfError}
        </p>
      ) : null}
      {twoPoolsError ? (
        <p className="text-main-red text-sm leading-snug" role="alert">
          Two-Pool indexer: {twoPoolsError}
        </p>
      ) : null}
      {cpfLoading && predictions.length === 0 ? (
        <p className="text-main-darkPurple/70 text-sm">Loading predictions…</p>
      ) : null}
      {twoPoolsLoading && twoPools.length === 0 ? (
        <p className="text-main-darkPurple/70 text-sm">Loading two-pools…</p>
      ) : null}
      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">{sectionTitle}</SectionHeader>
        <div className="flex flex-col gap-3">
          {visible.map((item) =>
            item.kind === "crypto" ? (
              <CryptocurrencyPredictionCard
                key={item.prediction.id}
                prediction={item.prediction}
                onPickBinaryOutcome={
                  item.prediction.predictionType === "above_below"
                    ? undefined
                    : (outcomeId) => handlePickBinaryOutcome(item.prediction, outcomeId)
                }
              />
            ) : (
              <TwoPoolCard key={item.pool.id} pool={item.pool} onJoin={handleJoinTwoPool} />
            )
          )}
        </div>
      </section>

      <CryptoPredictionDrawer
        prediction={drawerPrediction}
        selectedOutcomeId={drawerOutcomeId}
        open={drawerOpen}
        onOpenChange={handleCryptoDrawerOpenChange}
      />

      <TwoPoolDrawer
        pool={twoPoolDrawerPool}
        initialSide={twoPoolDrawerSide}
        open={twoPoolDrawerOpen}
        onOpenChange={handleTwoPoolDrawerOpenChange}
      />
    </div>
  );
}
