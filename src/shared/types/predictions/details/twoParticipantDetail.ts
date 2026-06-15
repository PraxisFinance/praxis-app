import type { PredictionParticipant } from "../core/participant";
import type { PredictionDetailCore } from "./core";

export type MatchProbabilityChartPoint = {
  timeLabel: string;
  participantAPercent: number;
  participantBPercent: number;
};

export type TwoParticipantPredictionDetail = PredictionDetailCore & {
  displayTitle: string;
  chartPoints: MatchProbabilityChartPoint[];
  participantAPoolPercent: number;
  participantBPoolPercent: number;
  resolutionDeadlineLabel?: string;
};

/** @deprecated Use `TwoParticipantPredictionDetail`. */
export type HubMatchHubDetail = TwoParticipantPredictionDetail;

/** @deprecated Use `MatchProbabilityChartPoint`. */
export type HubMatchProbabilityChartPoint = MatchProbabilityChartPoint;

/** @deprecated Use `PredictionParticipant`. */
export type HubMatchDetailTeam = PredictionParticipant;

export type HubMatchForDetailOutcomes = {
  isTradingOpen: boolean;
  participantA: PredictionParticipant;
  participantB: PredictionParticipant;
};

/** @deprecated fields — use participantA/participantB and isTradingOpen. */
export type LegacyHubMatchForDetailOutcomes = {
  isBettingAvailable: boolean;
  team1: PredictionParticipant;
  team2: PredictionParticipant;
};

export function toHubMatchForDetailOutcomes(
  card: HubMatchForDetailOutcomes,
): LegacyHubMatchForDetailOutcomes {
  return {
    isBettingAvailable: card.isTradingOpen,
    team1: card.participantA,
    team2: card.participantB,
  };
}

export function fromLegacyHubMatchForDetailOutcomes(
  match: LegacyHubMatchForDetailOutcomes,
): HubMatchForDetailOutcomes {
  return {
    isTradingOpen: match.isBettingAvailable,
    participantA: match.team1,
    participantB: match.team2,
  };
}
