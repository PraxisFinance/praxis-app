"use client";

import type { CryptoPredictionPriceRange } from "@/shared/types/cryptoPrediction";
import {
  CryptoPredictionHubDetailPriceChart,
  CryptoPredictionHubDetailResolution,
  CryptoPredictionHubDetailTitle,
  CryptoPredictionHubDetailUnavailable,
  getCryptoPredictionHubMarketDetail,
} from "../shared";
import { CryptoPredictionPriceRangeOutcomes } from "./CryptoPredictionPriceRangeOutcomes";

interface CryptoPredictionPriceRangeHubDetailProps {
  prediction: CryptoPredictionPriceRange;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionPriceRangeHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionPriceRangeHubDetailProps) {
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
      <CryptoPredictionPriceRangeOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
      <CryptoPredictionHubDetailResolution prediction={prediction} detail={detail} />
    </div>
  );
}
