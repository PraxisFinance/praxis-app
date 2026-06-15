import type {
  CryptoPrediction,
  CryptoPredictionHubMarketDetail,
  PriceChartPoint,
} from "@/shared/types/cryptoPrediction";

export type CryptoPredictionMarketDetailResolved = {
  baselinePriceLabel: string;
  priceChartPoints: PriceChartPoint[];
  resolutionAssetLabel: string;
  resolutionCloseDateLabel: string;
  resolutionReferenceDateLabel: string;
  resolutionReferencePriceLabel: string;
  resolutionSourceLabel?: string;
};

function isResolvedCryptoMarketDetail(
  detail: CryptoPredictionHubMarketDetail,
): detail is CryptoPredictionMarketDetailResolved {
  return (
    detail.baselinePriceLabel != null &&
    detail.priceChartPoints != null &&
    detail.resolutionAssetLabel != null &&
    detail.resolutionCloseDateLabel != null &&
    detail.resolutionReferenceDateLabel != null &&
    detail.resolutionReferencePriceLabel != null
  );
}

export function getCryptoPredictionHubMarketDetail(
  prediction: CryptoPrediction,
): CryptoPredictionMarketDetailResolved | undefined {
  const detail = prediction.detail ?? prediction.hubDetail ?? prediction.upDownDetail;
  if (detail == null || !isResolvedCryptoMarketDetail(detail)) {
    return undefined;
  }
  return detail;
}
