"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { getCryptoPredictionStatusFooter } from "@/shared/utils/cryptoPredictionFormat";

export interface CryptoPredictionCardStatusFooterProps {
  prediction: CryptoPrediction;
}

export function CryptoPredictionCardStatusFooter({ prediction }: CryptoPredictionCardStatusFooterProps) {
  const line = getCryptoPredictionStatusFooter(prediction);

  return (
    <div className="flex items-center justify-center gap-1.5">
      {line.showLiveDot && (
        <span className="bg-main-red h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
      )}
      <span className="text-main-darkPurple text-2xs font-medium">{line.text}</span>
    </div>
  );
}
