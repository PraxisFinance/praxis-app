import type { EsportsGameFilterId } from "@/shared/constants/esports";
import type { PredictionTwoParticipantCard } from "../cards/twoParticipantCard";
import type { TwoParticipantPredictionDetail } from "../details/twoParticipantDetail";

export type EsportsPredictionCard = PredictionTwoParticipantCard & {
  predictionType: "esports";
  gameId: EsportsGameFilterId;
  detail?: EsportsPredictionDetail;
};

export type EsportsPredictionDetail = TwoParticipantPredictionDetail;

/** @deprecated Use `EsportsPredictionCard`. */
export type EsportsMatch = EsportsPredictionCard;

/** @deprecated Use `EsportsPredictionDetail`. */
export type EsportsMatchHubDetail = EsportsPredictionDetail;

/** @deprecated Use `PredictionParticipant`. */
export type EsportsMatchTeam = EsportsPredictionCard["participantA"];

/** @deprecated Use `MatchProbabilityChartPoint`. */
export type EsportsMatchProbabilityChartPoint = EsportsPredictionDetail["chartPoints"][number];
