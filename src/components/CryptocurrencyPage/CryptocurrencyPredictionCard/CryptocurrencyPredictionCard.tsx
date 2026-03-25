"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { getCryptoPredictionEndLine } from "@/shared/utils/cryptoPredictionFormat";
import { CryptoPredictionCardBody } from "./CryptoPredictionCardBody";
import { CryptoPredictionCardHeader } from "./CryptoPredictionCardHeader";
import { CryptoPredictionCardMeta } from "./CryptoPredictionCardMeta";
import { CryptoPredictionCardStatusFooter } from "./CryptoPredictionCardStatusFooter";

export interface CryptocurrencyPredictionCardProps {
  prediction: CryptoPrediction;
}

export function CryptocurrencyPredictionCard({ prediction }: CryptocurrencyPredictionCardProps) {
  const endLine = getCryptoPredictionEndLine(prediction.endsAt);

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <CryptoPredictionCardHeader
        iconUrl={prediction.iconUrl}
        title={prediction.title}
        endLine={endLine}
      />
      <CryptoPredictionCardMeta prediction={prediction} />
      <CryptoPredictionCardBody prediction={prediction} />
      <CryptoPredictionCardStatusFooter prediction={prediction} />
    </article>
  );
}
