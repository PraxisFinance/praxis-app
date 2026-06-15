import type { PredictionsHubSportDisciplineId } from "@/shared/constants/predictionsHubFilters";
import type { PredictionTwoParticipantCard } from "../cards/twoParticipantCard";
import type { TwoParticipantPredictionDetail } from "../details/twoParticipantDetail";

export type SportPredictionCard = PredictionTwoParticipantCard & {
  predictionType: "sport";
  disciplineId: PredictionsHubSportDisciplineId;
  detail?: SportPredictionDetail;
};

export type SportPredictionDetail = TwoParticipantPredictionDetail;

/** @deprecated Use `SportPredictionCard`. */
export type SportHubMatch = SportPredictionCard;

/** @deprecated Use `SportPredictionDetail`. */
export type SportHubMatchDetail = SportPredictionDetail;

/** @deprecated Use `PredictionParticipant`. */
export type SportHubMatchTeam = SportPredictionCard["participantA"];
