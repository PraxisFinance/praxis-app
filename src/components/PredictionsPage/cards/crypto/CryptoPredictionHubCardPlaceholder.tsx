import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { HubCardShell } from "../HubCardShell";

interface CryptoPredictionHubCardPlaceholderProps {
  prediction: CryptoPrediction;
}

/** Temporary shell for hub card variants not implemented yet. */
export function CryptoPredictionHubCardPlaceholder({
  prediction,
}: CryptoPredictionHubCardPlaceholderProps) {
  return (
    <HubCardShell aria-label={`${prediction.predictionType} prediction ${prediction.id}`}>
      <p className="text-main-darkPurple/60 px-3 py-2 text-2xs capitalize">
        {prediction.predictionType.replace("_", " ")} card — coming soon
      </p>
    </HubCardShell>
  );
}
