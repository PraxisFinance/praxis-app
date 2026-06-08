"use client";

import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubStrikeRow } from "@/components/PredictionsPage/cards/crypto/CryptoPredictionHubStrikeRow";
import { CryptoPredictionHubDetailOutcomesSection } from "../shared";

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
      <div className="flex flex-col gap-2.5">
        {prediction.strikes.map((strike) => (
          <CryptoPredictionHubStrikeRow
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
