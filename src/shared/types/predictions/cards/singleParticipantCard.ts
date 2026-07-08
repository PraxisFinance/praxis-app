import type { PredictionCoreListItem } from "../core/listItemCore";
import type { PredictionBinaryOutcomes } from "../core/participant";

/** Politics, finance, tech — one subject with binary outcomes. */
export type PredictionSingleParticipantCard = PredictionCoreListItem & {
  title: string;
  imageUrl: string;
  isTradingOpen: boolean;
  volumeLabel?: string;
  description?: string | null;
  categories?: string[];
  outcomes: PredictionBinaryOutcomes;
  cpfPoolId: bigint;
  cpfAddress: `0x${string}`;
};
