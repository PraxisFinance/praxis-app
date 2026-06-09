"use client";

import type { CryptoPredictionUpDown } from "@/shared/types/cryptoPrediction";
import {
  CryptoPredictionHubDetailPriceChart,
  CryptoPredictionHubDetailResolution,
  CryptoPredictionHubDetailTitle,
  CryptoPredictionHubDetailUnavailable,
  getCryptoPredictionHubMarketDetail,
} from "../shared";
import { CryptoPredictionUpDownOutcomes } from "./CryptoPredictionUpDownOutcomes";

interface CryptoPredictionUpDownHubDetailProps {
  prediction: CryptoPredictionUpDown;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionUpDownHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionUpDownHubDetailProps) {
  const detail = getCryptoPredictionHubMarketDetail(prediction);

  if (!detail) {
    return <CryptoPredictionHubDetailUnavailable />;
  }

  return (
    <div className="flex flex-col gap-4">
      <CryptoPredictionHubDetailTitle iconUrl={prediction.iconUrl} title={prediction.title} />
      <CryptoPredictionHubDetailPriceChart
        baselinePriceLabel={detail.baselinePriceLabel}
        points={detail.priceChartPoints}
      />
      <CryptoPredictionUpDownOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
      <CryptoPredictionHubDetailResolution prediction={prediction} detail={detail} />
    </div>
  );
}
