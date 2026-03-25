"use client";

import { useState } from "react";
import type {
  CryptoPredictionTimeFilterId,
  CryptoPredictionTypeFilterId,
} from "@/shared/constants/cryptocurrencyPredictions";
import { CRYPTO_PREDICTION_MOCKS } from "@/shared/constants/cryptoPredictionMocks";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CryptocurrencyFilters } from "./CryptocurrencyFilters";
import { CryptocurrencyPredictionCard } from "./CryptocurrencyPredictionCard";

export function CryptocurrencyPage() {
  const [timeFilter, setTimeFilter] = useState<CryptoPredictionTimeFilterId>("all");
  const [typeFilter, setTypeFilter] = useState<CryptoPredictionTypeFilterId>("all");

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
            <CryptocurrencyPredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      </section>
    </div>
  );
}
