"use client";

import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import {
  buildCryptoAboveBelowHubTitle,
  getCryptoHubCardEndLine,
} from "@/shared/utils/cryptoHubFormat";
import { CryptoPredictionHubCardHeader } from "./CryptoPredictionHubCardHeader";
import { CryptoPredictionHubCardStatusFooter } from "./CryptoPredictionHubCardStatusFooter";
import { CryptoPredictionHubStrikeRow } from "./CryptoPredictionHubStrikeRow";

export interface CryptoPredictionAboveBelowHubCardProps {
  prediction: CryptoPredictionAboveBelow;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionAboveBelowHubCard({
  prediction,
  onPickOutcome,
}: CryptoPredictionAboveBelowHubCardProps) {
  const disabled = !prediction.isTradingOpen;
  const endLine = getCryptoHubCardEndLine(prediction.endsAt);
  const title =
    prediction.title.includes("__") || prediction.title.includes("above")
      ? prediction.title
      : buildCryptoAboveBelowHubTitle(prediction.assetSymbol, prediction.endsAt);

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <CryptoPredictionHubCardHeader
        iconUrl={prediction.iconUrl}
        title={title}
        endLine={endLine}
      />

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

      <CryptoPredictionHubCardStatusFooter prediction={prediction} align="start" />
    </article>
  );
}
