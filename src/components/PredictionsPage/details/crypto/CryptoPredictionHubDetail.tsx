"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionAboveBelowHubDetail } from "./above-below";
import { CryptoPredictionHitHubDetail } from "./hit";
import { CryptoPredictionPriceRangeHubDetail } from "./price-range";
import { CryptoPredictionUpDownHubDetail } from "./up-down";

interface CryptoPredictionHubDetailProps {
  prediction: CryptoPrediction;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionHubDetailProps) {
  switch (prediction.predictionType) {
    case "up_down":
      return (
        <CryptoPredictionUpDownHubDetail prediction={prediction} onPickOutcome={onPickOutcome} />
      );
    case "above_below":
      return (
        <CryptoPredictionAboveBelowHubDetail
          prediction={prediction}
          onPickOutcome={onPickOutcome}
        />
      );
    case "price_range":
      return (
        <CryptoPredictionPriceRangeHubDetail
          prediction={prediction}
          onPickOutcome={onPickOutcome}
        />
      );
    case "hit":
      return <CryptoPredictionHitHubDetail prediction={prediction} onPickOutcome={onPickOutcome} />;
    default: {
      const _exhaustive: never = prediction;
      return _exhaustive;
    }
  }
}
