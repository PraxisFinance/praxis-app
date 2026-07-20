"use client";

import type { CryptoPredictionHit } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubDetailShell } from "../shared";
import { CryptoPredictionHitOutcomes } from "./CryptoPredictionHitOutcomes";

interface CryptoPredictionHitHubDetailProps {
  prediction: CryptoPredictionHit;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionHitHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionHitHubDetailProps) {
  return (
    <CryptoPredictionHubDetailShell prediction={prediction}>
      <CryptoPredictionHitOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
    </CryptoPredictionHubDetailShell>
  );
}
