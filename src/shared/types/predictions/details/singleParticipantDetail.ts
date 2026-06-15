import type { PredictionParticipant } from "../core/participant";
import type { PredictionDetailCore } from "./core";

export type ProbabilityChartPoint = {
  timeLabel: string;
  yesPercent: number;
};

export type SingleParticipantPredictionDetail = PredictionDetailCore & {
  chartPoints: ProbabilityChartPoint[];
};

/** @deprecated Use `ProbabilityChartPoint`. */
export type PoliticsProbabilityChartPoint = ProbabilityChartPoint;

/** @deprecated Use `SingleParticipantPredictionDetail`. */
export type PoliticsHubEventDetail = SingleParticipantPredictionDetail;

export type { PredictionDetailCore } from "./core";
