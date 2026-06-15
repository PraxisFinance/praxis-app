import type { PredictionSingleParticipantCard } from "../cards/singleParticipantCard";
import type { SingleParticipantPredictionDetail } from "../details/singleParticipantDetail";

export type TechPredictionCard = PredictionSingleParticipantCard & {
  predictionType: "tech";
  detail?: TechPredictionDetail;
};

export type TechPredictionDetail = SingleParticipantPredictionDetail;

/** @deprecated Use `TechPredictionCard`. */
export type TechHubEvent = TechPredictionCard;

/** @deprecated Use `TechPredictionDetail`. */
export type TechHubEventDetail = TechPredictionDetail;

/** @deprecated Use `PredictionOutcome`. */
export type TechHubBinaryOutcome = TechPredictionCard["outcomes"][number];

/** @deprecated Use `ProbabilityChartPoint`. */
export type TechProbabilityChartPoint = TechPredictionDetail["chartPoints"][number];
