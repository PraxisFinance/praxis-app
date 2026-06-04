"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { getCryptoPredictionStatusFooter } from "@/shared/utils/cryptoPredictionFormat";

export interface CryptoPredictionHubCardStatusFooterProps {
  prediction: CryptoPrediction;
}

export function CryptoPredictionHubCardStatusFooter({
  prediction,
}: CryptoPredictionHubCardStatusFooterProps) {
  const line = getCryptoPredictionStatusFooter(prediction.status);

  return (
    <div className="flex items-center justify-center gap-1.5">
      {line.showLiveDot ? (
        <span className="bg-main-red h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
      ) : null}
      <span className="text-main-darkPurple text-2xs font-medium">{line.text}</span>
    </div>
  );
}
