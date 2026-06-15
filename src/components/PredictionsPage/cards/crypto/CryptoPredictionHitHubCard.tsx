"use client";

import type { CryptoPredictionHit } from "@/shared/types/cryptoPrediction";
import { getCryptoPredictionEndLine } from "@/shared/utils/cryptoPredictionFormat";
import { CryptoPredictionHubBinaryOutcomesBlock } from "./CryptoPredictionHubBinaryOutcomesBlock";
import { CryptoPredictionHubCardHeader } from "./CryptoPredictionHubCardHeader";
import { CryptoPredictionHubCardMeta } from "./CryptoPredictionHubCardMeta";

export interface CryptoPredictionHitHubCardProps {
  prediction: CryptoPredictionHit;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionHitHubCard({
  prediction,
  onPickOutcome,
}: CryptoPredictionHitHubCardProps) {
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

      <CryptoPredictionHubCardMeta prediction={prediction} />

      <CryptoPredictionHubBinaryOutcomesBlock
        outcomes={prediction.outcomes}
        disabled={disabled}
        onOutcomePick={onPickOutcome}
      />
    </article>
  );
}
