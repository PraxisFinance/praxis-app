"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { HubDetailShell } from "../HubDetailShell";
import { CryptoPredictionUpDownHubDetail } from "./up-down";

interface CryptoPredictionHubDetailProps {
  prediction: CryptoPrediction;
}

export function CryptoPredictionHubDetail({ prediction }: CryptoPredictionHubDetailProps) {
  switch (prediction.predictionType) {
    case "up_down":
      return <CryptoPredictionUpDownHubDetail prediction={prediction} />;
    case "above_below":
    case "price_range":
    case "hit":
      return (
        <HubDetailShell aria-label={`Crypto prediction detail ${prediction.id}`}>
          <p className="text-main-darkPurple text-sm font-medium">{prediction.title}</p>
          <p className="text-main-darkPurple/60 text-xs">{prediction.predictionType}</p>
        </HubDetailShell>
      );
    default: {
      const _exhaustive: never = prediction;
      return _exhaustive;
    }
  }
}
