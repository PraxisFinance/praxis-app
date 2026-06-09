"use client";

import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { CryptoPredictionUpDownDetailTitle } from "@/components/PredictionsPage/details/crypto/up-down/CryptoPredictionUpDownDetailTitle";
import { CryptoPredictionUpDownPriceChart } from "@/components/PredictionsPage/details/crypto/up-down/CryptoPredictionUpDownPriceChart";
import { FinanceEventDetailOutcomes } from "./FinanceEventDetailOutcomes";
import { FinanceEventDetailResolution } from "./FinanceEventDetailResolution";

interface FinanceEventHubDetailProps {
  event: FinanceHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function FinanceEventHubDetail({ event, onPickOutcome }: FinanceEventHubDetailProps) {
  const detail = event.financeDetail;

  if (!detail) {
    return (
      <p className="text-main-darkPurple/60 text-sm">Detail data is not available for this market.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CryptoPredictionUpDownDetailTitle iconUrl={event.logoUrl} title={event.title} />
      <CryptoPredictionUpDownPriceChart
        baselinePriceLabel={detail.baselinePriceLabel}
        points={detail.priceChartPoints}
      />
      <FinanceEventDetailOutcomes event={event} onPickOutcome={onPickOutcome} />
      <FinanceEventDetailResolution event={event} detail={detail} />
    </div>
  );
}
