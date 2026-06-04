"use client";

import type { CryptoBinaryOutcome } from "@/shared/types/cryptoPrediction";
import { Button } from "@/components/ui/button";
import { CryptoPredictionHubPoolSplit } from "./CryptoPredictionHubPoolSplit";

interface CryptoPredictionHubBinaryOutcomesBlockProps {
  outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome];
  disabled: boolean;
  onOutcomePick?: (outcomeId: string) => void;
}

export function CryptoPredictionHubBinaryOutcomesBlock({
  outcomes,
  disabled,
  onOutcomePick,
}: CryptoPredictionHubBinaryOutcomesBlockProps) {
  const [first, second] = outcomes;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onOutcomePick?.(first.id)}
          >
            {first.label}
          </Button>
        </div>
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onOutcomePick?.(second.id)}
          >
            {second.label}
          </Button>
        </div>
      </div>

      <CryptoPredictionHubPoolSplit left={first} right={second} />
    </div>
  );
}
