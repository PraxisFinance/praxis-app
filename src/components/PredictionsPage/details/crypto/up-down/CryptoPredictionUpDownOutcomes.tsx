"use client";

import { Button } from "@/components/ui/button";
import type { CryptoPredictionUpDown } from "@/shared/types/cryptoPrediction";
import {
  CryptoPredictionHubDetailOutcomesSection,
  CryptoPredictionHubDetailPoolSplit,
} from "../shared";

interface CryptoPredictionUpDownOutcomesProps {
  prediction: CryptoPredictionUpDown;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionUpDownOutcomes({
  prediction,
  onPickOutcome,
}: CryptoPredictionUpDownOutcomesProps) {
  const [up, down] = prediction.outcomes;
  const disabled = !prediction.isTradingOpen;

  return (
    <CryptoPredictionHubDetailOutcomesSection>
      <div className="flex gap-3">
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onPickOutcome?.(up.id)}
          >
            {up.label}
          </Button>
        </div>
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onPickOutcome?.(down.id)}
          >
            {down.label}
          </Button>
        </div>
      </div>

      <CryptoPredictionHubDetailPoolSplit left={up} right={down} />
    </CryptoPredictionHubDetailOutcomesSection>
  );
}
