"use client";

import { Button } from "@/components/ui/button";
import type { CryptoPredictionPriceRange } from "@/shared/types/cryptoPrediction";
import {
  CryptoPredictionHubDetailOutcomesSection,
  CryptoPredictionHubDetailPoolSplit,
} from "../shared";

interface CryptoPredictionPriceRangeOutcomesProps {
  prediction: CryptoPredictionPriceRange;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionPriceRangeOutcomes({
  prediction,
  onPickOutcome,
}: CryptoPredictionPriceRangeOutcomesProps) {
  const [inside, outside] = prediction.outcomes;
  const disabled = !prediction.isTradingOpen;

  return (
    <CryptoPredictionHubDetailOutcomesSection>
      <p className="text-main-darkPurple/80 -mt-1 text-xs font-medium">
        Range {prediction.lowerBoundLabel} — {prediction.upperBoundLabel}
      </p>

      <div className="flex gap-3">
        <div className="h-11 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full rounded-[8px] text-base text-white"
            onClick={() => onPickOutcome?.(inside.id)}
          >
            {inside.label}
          </Button>
        </div>
        <div className="h-11 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className="h-full rounded-[8px] text-base text-white"
            onClick={() => onPickOutcome?.(outside.id)}
          >
            {outside.label}
          </Button>
        </div>
      </div>

      <CryptoPredictionHubDetailPoolSplit left={inside} right={outside} />
    </CryptoPredictionHubDetailOutcomesSection>
  );
}
