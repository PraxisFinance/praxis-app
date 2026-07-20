"use client";

import type { CryptoPredictionUpDown } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubDetailShell } from "../shared";
import { CryptoPredictionUpDownOutcomes } from "./CryptoPredictionUpDownOutcomes";

interface CryptoPredictionUpDownHubDetailProps {
  prediction: CryptoPredictionUpDown;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionUpDownHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionUpDownHubDetailProps) {
  return (
    <CryptoPredictionHubDetailShell prediction={prediction}>
      <CryptoPredictionUpDownOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
    </CryptoPredictionHubDetailShell>
  );
}
