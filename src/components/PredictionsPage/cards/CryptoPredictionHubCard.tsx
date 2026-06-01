import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { HubCardShell } from "./HubCardShell";

interface CryptoPredictionHubCardProps {
  prediction: CryptoPrediction;
}

export function CryptoPredictionHubCard({ prediction }: CryptoPredictionHubCardProps) {
  return <HubCardShell aria-label={`Crypto prediction ${prediction.id}`} />;
}
