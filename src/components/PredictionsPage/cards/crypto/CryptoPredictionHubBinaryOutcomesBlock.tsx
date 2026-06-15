"use client";

import type { PredictionBinaryOutcomes } from "@/shared/types/predictions";
import { Button } from "@/components/ui/button";
import { stopHubCardLinkNavigation } from "../stopHubCardLinkNavigation";
import { CryptoPredictionHubPoolSplit } from "./CryptoPredictionHubPoolSplit";

interface CryptoPredictionHubBinaryOutcomesBlockProps {
  outcomes: PredictionBinaryOutcomes;
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
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onOutcomePick?.(first.id);
            }}
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
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onOutcomePick?.(second.id);
            }}
          >
            {second.label}
          </Button>
        </div>
      </div>

      <CryptoPredictionHubPoolSplit left={first} right={second} />
    </div>
  );
}
