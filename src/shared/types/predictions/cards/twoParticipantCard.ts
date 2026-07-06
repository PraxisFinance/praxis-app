import type { PredictionCoreListItem } from "../core/listItemCore";
import type { PredictionParticipant } from "../core/participant";

/** Sport and esports — two competing participants. */
export type PredictionTwoParticipantCard = PredictionCoreListItem & {
  isTradingOpen: boolean;
  streamUrl?: string;
  participantA: PredictionParticipant;
  participantB: PredictionParticipant;
  /**
   * External match ID from the upstream sports/esports data provider.
   * Used to correlate `live_sports_update` / `live_esports_update` WebSocket
   * payloads with this card. Set from `EventMetadata.matchId` when present.
   */
  externalMatchId?: string;
};
