import type {
  CryptoPrediction,
  CryptoPredictionHubMarketDetail,
} from "@/shared/types/cryptoPrediction";

export function getCryptoPredictionHubMarketDetail(
  prediction: CryptoPrediction,
): CryptoPredictionHubMarketDetail | undefined {
  if (prediction.predictionType === "up_down") {
    return prediction.upDownDetail ?? prediction.hubDetail;
  }
  return prediction.hubDetail;
}
