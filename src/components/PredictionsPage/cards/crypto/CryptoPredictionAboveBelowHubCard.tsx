"use client";

import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import { getCryptoPredictionEndLine } from "@/shared/utils/cryptoPredictionFormat";
import { CryptoPredictionHubCardHeader } from "./CryptoPredictionHubCardHeader";
import { CryptoPredictionHubCardStatusFooter } from "./CryptoPredictionHubCardStatusFooter";
import { CryptoPredictionHubStrikeRow } from "./CryptoPredictionHubStrikeRow";

export interface CryptoPredictionAboveBelowHubCardProps {
  prediction: CryptoPredictionAboveBelow;
}

export function CryptoPredictionAboveBelowHubCard({
  prediction,
}: CryptoPredictionAboveBelowHubCardProps) {
  const disabled = !prediction.isTradingOpen;
  const endLine = getCryptoPredictionEndLine(prediction.endsAt);

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <CryptoPredictionHubCardHeader
        iconUrl={prediction.iconUrl}
        title={prediction.title}
        endLine={endLine}
        volumeLabel={prediction.volumeLabel}
      />

      <div className="flex flex-col gap-2.5">
        {prediction.strikes.map((strike) => (
          <CryptoPredictionHubStrikeRow key={strike.id} strike={strike} disabled={disabled} />
        ))}
      </div>

      <CryptoPredictionHubCardStatusFooter prediction={prediction} />
    </article>
  );
}
