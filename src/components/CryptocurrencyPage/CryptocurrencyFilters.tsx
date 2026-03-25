"use client";

import {
  CRYPTO_PREDICTION_TIME_FILTERS,
  CRYPTO_PREDICTION_TYPE_FILTERS,
  type CryptoPredictionTimeFilterId,
  type CryptoPredictionTypeFilterId,
} from "@/shared/constants/cryptocurrencyPredictions";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface CryptocurrencyFiltersProps {
  timeId: CryptoPredictionTimeFilterId;
  onTimeChange: (id: CryptoPredictionTimeFilterId) => void;
  typeId: CryptoPredictionTypeFilterId;
  onTypeChange: (id: CryptoPredictionTypeFilterId) => void;
}

export function CryptocurrencyFilters({
  timeId,
  onTimeChange,
  typeId,
  onTypeChange,
}: CryptocurrencyFiltersProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader className="text-main-darkPurple">Filters</SectionHeader>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cryptocurrency prediction timeframe">
        {CRYPTO_PREDICTION_TIME_FILTERS.map(({ id, label }) => {
          const isActive = timeId === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTimeChange(id)}
              className={cn(
                "px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all",
                isActive
                  ? "bg-main-purple text-white"
                  : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cryptocurrency prediction type">
        {CRYPTO_PREDICTION_TYPE_FILTERS.map(({ id, label }) => {
          const isActive = typeId === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTypeChange(id)}
              className={cn(
                "px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all",
                isActive
                  ? "bg-main-purple text-white"
                  : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
