import type { PredictionCoreListItem } from "../core/listItemCore";
import type { PredictionParticipant } from "../core/participant";

/** Sport and esports — two competing participants. */
export type PredictionTwoParticipantCard = PredictionCoreListItem & {
  isTradingOpen: boolean;
  streamUrl?: string;
  participantA: PredictionParticipant;
  participantB: PredictionParticipant;
};
