"use client";

import type { CryptoPredictionPriceRange } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubDetailShell } from "../shared";
import { CryptoPredictionPriceRangeOutcomes } from "./CryptoPredictionPriceRangeOutcomes";

interface CryptoPredictionPriceRangeHubDetailProps {
  prediction: CryptoPredictionPriceRange;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionPriceRangeHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionPriceRangeHubDetailProps) {
  return (
    <CryptoPredictionHubDetailShell prediction={prediction}>
      <CryptoPredictionPriceRangeOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
    </CryptoPredictionHubDetailShell>
  );
}
