"use client";

import { useState } from "react";
import type {
  CryptoPredictionTimeFilterId,
  CryptoPredictionTypeFilterId,
} from "@/shared/constants/cryptocurrencyPredictions";
import { CRYPTO_PREDICTION_MOCKS } from "@/shared/constants/cryptoPredictionMocks";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CryptocurrencyFilters } from "./CryptocurrencyFilters";
import { CryptoPredictionDrawer } from "./CryptoPredictionDrawer";
import { CryptocurrencyPredictionCard } from "./CryptocurrencyPredictionCard";

export function CryptocurrencyPage() {
  const [timeFilter, setTimeFilter] = useState<CryptoPredictionTimeFilterId>("all");
  const [typeFilter, setTypeFilter] = useState<CryptoPredictionTypeFilterId>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPrediction, setDrawerPrediction] = useState<CryptoPrediction | null>(null);
  const [drawerOutcomeId, setDrawerOutcomeId] = useState<string | null>(null);

  const handleDrawerOpenChange = (open: boolean) => {
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

  return (
    <div className="flex flex-col gap-4">
      <CryptocurrencyFilters
        timeId={timeFilter}
        onTimeChange={setTimeFilter}
        typeId={typeFilter}
        onTypeChange={setTypeFilter}
      />
      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Cryptocurrencies</SectionHeader>
        <div className="flex flex-col gap-3">
          {CRYPTO_PREDICTION_MOCKS.map((prediction) => (
            <CryptocurrencyPredictionCard
              key={prediction.id}
              prediction={prediction}
              onPickBinaryOutcome={
                prediction.predictionType === "above_below"
                  ? undefined
                  : (outcomeId) => handlePickBinaryOutcome(prediction, outcomeId)
              }
            />
          ))}
        </div>
      </section>

      <CryptoPredictionDrawer
        prediction={drawerPrediction}
        selectedOutcomeId={drawerOutcomeId}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}
