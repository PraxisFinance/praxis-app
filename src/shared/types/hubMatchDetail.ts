/** Shared hub match detail types (esports + sport). */
export type HubMatchDetailTeam = {
  name: string;
  logoUrl: string;
  odds: number;
  score?: number;
};

export type HubMatchProbabilityChartPoint = {
  timeLabel: string;
  team1Percent: number;
  team2Percent: number;
};

export type HubMatchHubDetail = {
  displayTitle: string;
  volumeLabel: string;
  chartPoints: HubMatchProbabilityChartPoint[];
  team1PoolPercent: number;
  team2PoolPercent: number;
  /** Sport resolution copy — optional. */
  resolutionDeadlineLabel?: string;
};

export type HubMatchForDetailOutcomes = {
  isBettingAvailable: boolean;
  team1: HubMatchDetailTeam;
  team2: HubMatchDetailTeam;
};
