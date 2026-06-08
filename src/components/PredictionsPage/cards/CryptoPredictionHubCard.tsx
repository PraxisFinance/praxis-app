"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionAboveBelowHubCard } from "./crypto/CryptoPredictionAboveBelowHubCard";
import { CryptoPredictionHitHubCard } from "./crypto/CryptoPredictionHitHubCard";
import { CryptoPredictionPriceRangeHubCard } from "./crypto/CryptoPredictionPriceRangeHubCard";
import { CryptoPredictionUpDownHubCard } from "./crypto/CryptoPredictionUpDownHubCard";

interface CryptoPredictionHubCardProps {
  prediction: CryptoPrediction;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionHubCard({ prediction, onPickOutcome }: CryptoPredictionHubCardProps) {
  switch (prediction.predictionType) {
    case "up_down":
      return (
        <CryptoPredictionUpDownHubCard prediction={prediction} onPickOutcome={onPickOutcome} />
      );
    case "above_below":
      return (
        <CryptoPredictionAboveBelowHubCard
          prediction={prediction}
          onPickOutcome={onPickOutcome}
        />
      );
    case "price_range":
      return (
        <CryptoPredictionPriceRangeHubCard prediction={prediction} onPickOutcome={onPickOutcome} />
      );
    case "hit":
      return <CryptoPredictionHitHubCard prediction={prediction} onPickOutcome={onPickOutcome} />;
    default: {
      const _exhaustive: never = prediction;
      return _exhaustive;
    }
  }
}
