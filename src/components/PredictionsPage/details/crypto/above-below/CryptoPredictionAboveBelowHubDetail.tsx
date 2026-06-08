"use client";

import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import {
  CryptoPredictionHubDetailPriceChart,
  CryptoPredictionHubDetailResolution,
  CryptoPredictionHubDetailTitle,
  CryptoPredictionHubDetailUnavailable,
  getCryptoPredictionHubMarketDetail,
} from "../shared";
import { CryptoPredictionAboveBelowOutcomes } from "./CryptoPredictionAboveBelowOutcomes";

interface CryptoPredictionAboveBelowHubDetailProps {
  prediction: CryptoPredictionAboveBelow;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionAboveBelowHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionAboveBelowHubDetailProps) {
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
      <CryptoPredictionAboveBelowOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
      <CryptoPredictionHubDetailResolution prediction={prediction} detail={detail} />
    </div>
  );
}
