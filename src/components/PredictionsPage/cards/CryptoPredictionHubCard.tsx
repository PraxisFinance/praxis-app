"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubCardPlaceholder } from "./crypto/CryptoPredictionHubCardPlaceholder";
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
    case "price_range":
    case "hit":
      return <CryptoPredictionHubCardPlaceholder prediction={prediction} />;
    default: {
      const _exhaustive: never = prediction;
      return _exhaustive;
    }
  }
}
