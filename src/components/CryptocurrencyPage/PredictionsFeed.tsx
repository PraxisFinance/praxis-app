"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CryptoPredictionTimeFilterId,
  CryptoPredictionTypeFilterId,
} from "@/shared/constants/cryptocurrencyPredictions";
import { CRYPTO_PREDICTION_MOCKS } from "@/shared/constants/cryptoPredictionMocks";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";
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

function buildMergedFeed(twoPools: TwoPool[], twoPoolsFirst: boolean): FeedItem[] {
  const items: FeedItem[] = [
    ...CRYPTO_PREDICTION_MOCKS.map((prediction) => ({ kind: "crypto" as const, prediction })),
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

export interface PredictionsFeedProps {
  sectionTitle: string;
  /** When true (Cryptocurrencies tab), Two-Pool cards are listed before other prediction cards. */
  twoPoolsFirst?: boolean;
}

export function PredictionsFeed({ sectionTitle, twoPoolsFirst = false }: PredictionsFeedProps) {
  const twoPools = useTwoPoolsStore((s) => s.pools);
  const twoPoolsLoading = useTwoPoolsStore((s) => s.loading);
  const twoPoolsError = useTwoPoolsStore((s) => s.error);
  const fetchTwoPools = useTwoPoolsStore((s) => s.fetchPools);

  useEffect(() => {
    void fetchTwoPools();
  }, [fetchTwoPools]);

  const [timeFilter, setTimeFilter] = useState<CryptoPredictionTimeFilterId>("all");
  const [typeFilter, setTypeFilter] = useState<CryptoPredictionTypeFilterId>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPrediction, setDrawerPrediction] = useState<CryptoPrediction | null>(null);
  const [drawerOutcomeId, setDrawerOutcomeId] = useState<string | null>(null);

  const [twoPoolDrawerOpen, setTwoPoolDrawerOpen] = useState(false);
  const [twoPoolDrawerPool, setTwoPoolDrawerPool] = useState<TwoPool | null>(null);
  const [twoPoolDrawerSide, setTwoPoolDrawerSide] = useState<TwoPoolSide | null>(null);

  const merged = useMemo(
    () => buildMergedFeed(twoPools, twoPoolsFirst),
    [twoPools, twoPoolsFirst]
  );
  // timeFilter is wired to the filter bar UI but not yet applied to list filtering
  const visible = useMemo(
    () => merged.filter((item) => matchesTypeFilter(item, typeFilter)),
    [merged, typeFilter]
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
      {twoPoolsError ? (
        <p className="text-main-red text-sm leading-snug" role="alert">
          Two-Pool indexer: {twoPoolsError}
        </p>
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
