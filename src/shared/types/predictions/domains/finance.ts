import type { PredictionSingleParticipantCard } from "../cards/singleParticipantCard";
import type { CryptoPredictionDetail } from "../details/cryptoDetail";

export type FinancePredictionCard = PredictionSingleParticipantCard & {
  predictionType: "finance";
  assetName: string;
  assetTicker: string;
  detail?: FinancePredictionDetail;
};

export type FinancePredictionDetail = CryptoPredictionDetail;

export type PriceChartPoint = {
  timeLabel: string;
  price: number;
};

export function buildFinanceHubTitle(assetName: string, assetTicker: string): string {
  const ticker = assetTicker.trim();
  return ticker.length > 0 ? `${assetName} (${ticker}) Up or Down` : `${assetName} Up or Down`;
}

/** @deprecated Use `FinancePredictionCard`. */
export type FinanceHubEvent = FinancePredictionCard;

/** @deprecated Use `FinancePredictionDetail`. */
export type FinanceHubEventDetail = FinancePredictionDetail;

/** @deprecated Use `PredictionOutcome`. */
export type FinanceHubBinaryOutcome = FinancePredictionCard["outcomes"][number];

/** @deprecated Use `PriceChartPoint`. */
export type CryptoPredictionPriceChartPoint = PriceChartPoint;

/** @deprecated Use `FinancePredictionDetail`. */
export type CryptoPredictionHubMarketDetail = FinancePredictionDetail;

/** @deprecated Use `FinancePredictionDetail`. */
export type CryptoPredictionUpDownDetail = FinancePredictionDetail;
