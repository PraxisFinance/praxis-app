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
    case "crypto_up_down":
      return (
        <CryptoPredictionUpDownHubCard prediction={prediction} onPickOutcome={onPickOutcome} />
      );
    case "crypto_above_below":
      return (
        <CryptoPredictionAboveBelowHubCard
          prediction={prediction}
          onPickOutcome={onPickOutcome}
        />
      );
    case "crypto_price_range":
      return (
        <CryptoPredictionPriceRangeHubCard prediction={prediction} onPickOutcome={onPickOutcome} />
      );
    case "crypto_hit":
      return <CryptoPredictionHitHubCard prediction={prediction} onPickOutcome={onPickOutcome} />;
  }
}
