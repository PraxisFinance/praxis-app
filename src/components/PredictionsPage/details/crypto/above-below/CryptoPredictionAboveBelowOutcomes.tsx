"use client";

import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubDetailOutcomesSection } from "../shared";
import { CryptoPredictionAboveBelowDetailStrikeRow } from "./CryptoPredictionAboveBelowDetailStrikeRow";

interface CryptoPredictionAboveBelowOutcomesProps {
  prediction: CryptoPredictionAboveBelow;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionAboveBelowOutcomes({
  prediction,
  onPickOutcome,
}: CryptoPredictionAboveBelowOutcomesProps) {
  const disabled = !prediction.isTradingOpen;

  return (
    <CryptoPredictionHubDetailOutcomesSection>
      <div className="flex flex-col gap-4">
        {prediction.strikes.map((strike) => (
          <CryptoPredictionAboveBelowDetailStrikeRow
            key={strike.id}
            strike={strike}
            disabled={disabled}
            onPickYes={(strikeId) => onPickOutcome?.(`${strikeId}:yes`)}
            onPickNo={(strikeId) => onPickOutcome?.(`${strikeId}:no`)}
          />
        ))}
      </div>
    </CryptoPredictionHubDetailOutcomesSection>
  );
}
