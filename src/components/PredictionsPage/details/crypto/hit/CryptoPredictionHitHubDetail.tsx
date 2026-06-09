"use client";

import type { CryptoPredictionHit } from "@/shared/types/cryptoPrediction";
import {
  CryptoPredictionHubDetailPriceChart,
  CryptoPredictionHubDetailResolution,
  CryptoPredictionHubDetailTitle,
  CryptoPredictionHubDetailUnavailable,
  getCryptoPredictionHubMarketDetail,
} from "../shared";
import { CryptoPredictionHitOutcomes } from "./CryptoPredictionHitOutcomes";

interface CryptoPredictionHitHubDetailProps {
  prediction: CryptoPredictionHit;
  onPickOutcome?: (outcomeId: string) => void;
}

export function CryptoPredictionHitHubDetail({
  prediction,
  onPickOutcome,
}: CryptoPredictionHitHubDetailProps) {
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
      <CryptoPredictionHitOutcomes prediction={prediction} onPickOutcome={onPickOutcome} />
      <CryptoPredictionHubDetailResolution prediction={prediction} detail={detail} />
    </div>
  );
}
