"use client";

import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { useEventsStore } from "@/stores/eventsStore";
import { useOraclePrice, formatOraclePrice } from "@/hooks/useOraclePrice";
import { CryptoPredictionUpDownDetailTitle } from "@/components/PredictionsPage/details/crypto/up-down/CryptoPredictionUpDownDetailTitle";
import { CryptoPredictionUpDownPriceChart } from "@/components/PredictionsPage/details/crypto/up-down/CryptoPredictionUpDownPriceChart";
import { FinanceEventDetailOutcomes } from "./FinanceEventDetailOutcomes";
import { FinanceEventDetailResolution } from "./FinanceEventDetailResolution";

interface FinanceEventHubDetailProps {
  event: FinanceHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function FinanceEventHubDetail({ event, onPickOutcome }: FinanceEventHubDetailProps) {
  const detail = event.detail;

  // Resolve conditionId so we can subscribe to oracle prices for this market.
  const conditionId = useEventsStore((s) => s.pools[event.id]?.state?.conditionId ?? null);
  const oraclePrice = useOraclePrice(conditionId);

  // Narrow once so the chart below gets non-nullable fields without re-checking or asserting.
  const chartData =
    detail?.baselinePriceLabel != null && detail?.priceChartPoints != null
      ? { baselinePriceLabel: detail.baselinePriceLabel, points: detail.priceChartPoints }
      : null;

  return (
    <div className="flex flex-col gap-4">
      <CryptoPredictionUpDownDetailTitle iconUrl={event.imageUrl} title={event.title} />

      {oraclePrice != null && (
        <div className="bg-main-lightGray flex items-center justify-between rounded-[10px] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="bg-main-red h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
            <span className="text-main-darkPurple text-xs font-medium">Live Price</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-main-darkPurple text-sm font-semibold tabular-nums">
              {formatOraclePrice(oraclePrice.value)}
            </span>
            <span className="text-main-darkPurple/50 text-2xs">
              via {oraclePrice.source}
            </span>
          </div>
        </div>
      )}

      {chartData != null && (
        <CryptoPredictionUpDownPriceChart
          baselinePriceLabel={chartData.baselinePriceLabel}
          points={chartData.points}
        />
      )}

      <FinanceEventDetailOutcomes event={event} onPickOutcome={onPickOutcome} />
      {detail != null && <FinanceEventDetailResolution event={event} detail={detail} />}
    </div>
  );
}
