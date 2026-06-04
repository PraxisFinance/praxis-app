"use client";

import type { CryptoPredictionUpDown } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionUpDownDetailTitle } from "./CryptoPredictionUpDownDetailTitle";
import { CryptoPredictionUpDownOutcomes } from "./CryptoPredictionUpDownOutcomes";
import { CryptoPredictionUpDownPriceChart } from "./CryptoPredictionUpDownPriceChart";
import { CryptoPredictionUpDownResolution } from "./CryptoPredictionUpDownResolution";

interface CryptoPredictionUpDownHubDetailProps {
  prediction: CryptoPredictionUpDown;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionUpDownHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionUpDownHubDetailProps) {
  const detail = prediction.upDownDetail;

  if (!detail) {
    return (
      <p className="text-main-darkPurple/60 text-sm">Detail data is not available for this market.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CryptoPredictionUpDownDetailTitle iconUrl={prediction.iconUrl} title={prediction.title} />
      <CryptoPredictionUpDownPriceChart
        baselinePriceLabel={detail.baselinePriceLabel}
        points={detail.priceChartPoints}
      />
      <CryptoPredictionUpDownOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
      <CryptoPredictionUpDownResolution prediction={prediction} detail={detail} />
    </div>
  );
}
