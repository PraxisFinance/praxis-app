"use client";

import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubDetailShell } from "../shared";
import { CryptoPredictionAboveBelowOutcomes } from "./CryptoPredictionAboveBelowOutcomes";

interface CryptoPredictionAboveBelowHubDetailProps {
  prediction: CryptoPredictionAboveBelow;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionAboveBelowHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionAboveBelowHubDetailProps) {
  return (
    <CryptoPredictionHubDetailShell prediction={prediction}>
      <CryptoPredictionAboveBelowOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
    </CryptoPredictionHubDetailShell>
  );
}
