"use client";

import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionBinaryOutcomesBlock } from "./CryptoPredictionBinaryOutcomesBlock";
import { CryptoPredictionStrikeRow } from "./CryptoPredictionStrikeRow";

export interface CryptoPredictionCardBodyProps {
  prediction: CryptoPrediction;
}

export function CryptoPredictionCardBody({ prediction }: CryptoPredictionCardBodyProps) {
  const disabled = !prediction.isTradingOpen;

  switch (prediction.predictionType) {
    case "up_down":
    case "price_range":
    case "hit":
      return <CryptoPredictionBinaryOutcomesBlock outcomes={prediction.outcomes} disabled={disabled} />;
    case "above_below":
      return (
        <div className="flex flex-col gap-2.5">
          {prediction.strikes.map((s) => (
            <CryptoPredictionStrikeRow key={s.id} strike={s} disabled={disabled} />
          ))}
        </div>
      );
    default: {
      const _exhaustive: never = prediction;
      return _exhaustive;
    }
  }
}
