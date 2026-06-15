"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { getCryptoMarketType } from "@/shared/types/predictions";

export interface CryptoPredictionHubCardMetaProps {
  prediction: CryptoPrediction;
}

export function CryptoPredictionHubCardMeta({ prediction }: CryptoPredictionHubCardMetaProps) {
  if (prediction.predictionType === "crypto_price_range") {
    return (
      <p className="text-main-darkPurple/80 text-2xs font-medium">
        Range {prediction.lowerBoundLabel} — {prediction.upperBoundLabel}
      </p>
    );
  }
  if (prediction.predictionType === "crypto_hit") {
    return (
      <p className="text-main-darkPurple/80 text-2xs font-medium">
        Target {prediction.targetPriceLabel}
      </p>
    );
  }
  return null;
}
