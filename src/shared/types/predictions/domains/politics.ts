import type { PredictionSingleParticipantCard } from "../cards/singleParticipantCard";
import type { SingleParticipantPredictionDetail } from "../details/singleParticipantDetail";

export type PoliticsPredictionCard = PredictionSingleParticipantCard & {
  predictionType: "politics";
  detail?: PoliticsPredictionDetail;
};

export type PoliticsPredictionDetail = SingleParticipantPredictionDetail;

/** @deprecated Use `PoliticsPredictionCard`. */
export type PoliticsHubEvent = PoliticsPredictionCard;

/** @deprecated Use `PoliticsPredictionDetail`. */
export type PoliticsHubEventDetail = PoliticsPredictionDetail;

/** @deprecated Use `PredictionOutcome`. */
export type PoliticsHubBinaryOutcome = PoliticsPredictionCard["outcomes"][number];
