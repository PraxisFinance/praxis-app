import type { PriceChartPoint } from "../domains/finance";

export type CryptoPredictionDetail = {
  id?: string;
  volumeLabel?: string;
  resolutionParagraphs?: string[];
  baselinePriceLabel?: string;
  priceChartPoints?: PriceChartPoint[];
  resolutionAssetLabel?: string;
  resolutionCloseDateLabel?: string;
  resolutionReferenceDateLabel?: string;
  resolutionReferencePriceLabel?: string;
  resolutionSourceLabel?: string;
};
