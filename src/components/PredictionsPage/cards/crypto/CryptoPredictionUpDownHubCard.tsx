"use client";

import type { CryptoPredictionUpDown } from "@/shared/types/cryptoPrediction";
import { getCryptoPredictionEndLine } from "@/shared/utils/cryptoPredictionFormat";
import { Button } from "@/components/ui/button";
import { stopHubCardLinkNavigation } from "../stopHubCardLinkNavigation";
import { CryptoPredictionHubCardHeader } from "./CryptoPredictionHubCardHeader";
import { CryptoPredictionHubPoolSplit } from "./CryptoPredictionHubPoolSplit";

export interface CryptoPredictionUpDownHubCardProps {
  prediction: CryptoPredictionUpDown;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionUpDownHubCard({
  prediction,
  onPickOutcome,
}: CryptoPredictionUpDownHubCardProps) {
  const [up, down] = prediction.outcomes;
  const disabled = !prediction.isTradingOpen;
  const endLine = getCryptoPredictionEndLine(prediction.endsAt ?? "");

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <CryptoPredictionHubCardHeader
        iconUrl={prediction.iconUrl}
        title={prediction.title}
        endLine={endLine}
        volumeLabel={prediction.volumeLabel}
      />

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
              onPickOutcome?.(up.id);
            }}
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
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onPickOutcome?.(down.id);
            }}
          >
            {down.label}
          </Button>
        </div>
      </div>

      <CryptoPredictionHubPoolSplit left={up} right={down} />
    </article>
  );
}
