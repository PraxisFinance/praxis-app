"use client";

import type { ReactNode } from "react";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionHubDetailPriceChart } from "./CryptoPredictionHubDetailPriceChart";
import { CryptoPredictionHubDetailResolution } from "./CryptoPredictionHubDetailResolution";
import { CryptoPredictionHubDetailTitle } from "./CryptoPredictionHubDetailTitle";
import { getCryptoPredictionHubMarketDetail } from "./getCryptoPredictionHubMarketDetail";

interface CryptoPredictionHubDetailShellProps {
  prediction: CryptoPrediction;
  /** Market-type specific outcome buttons, rendered between the chart and resolution. */
  children: ReactNode;
}

/**
 * Shared layout for crypto hub detail screens: title, optional price chart,
 * per-market outcomes, and optional resolution. Chart and resolution render
 * only when a resolved market detail payload is available.
 */
export function CryptoPredictionHubDetailShell({
  prediction,
  children,
}: CryptoPredictionHubDetailShellProps) {
  const detail = getCryptoPredictionHubMarketDetail(prediction);

  return (
    <div className="flex flex-col gap-4">
      <CryptoPredictionHubDetailTitle iconUrl={prediction.iconUrl} title={prediction.title} />
      {detail != null && (
        <CryptoPredictionHubDetailPriceChart
          baselinePriceLabel={detail.baselinePriceLabel}
          points={detail.priceChartPoints}
        />
      )}
      {children}
      {detail != null && (
        <CryptoPredictionHubDetailResolution prediction={prediction} detail={detail} />
      )}
    </div>
  );
}
