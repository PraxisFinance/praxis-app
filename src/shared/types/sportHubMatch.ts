import type { PredictionsHubSportDisciplineId } from "@/shared/constants/predictionsHubFilters";
import type { HubMatchHubDetail } from "@/shared/types/hubMatchDetail";
import type { EsportsMatchStatus } from "@/shared/types/esportsMatch";

export type { HubMatchHubDetail as SportHubMatchDetail } from "@/shared/types/hubMatchDetail";

export type SportHubMatchTeam = {
  name: string;
  logoUrl: string;
  odds: number;
  score?: number;
};

export type SportHubMatch = {
  id: string;
  disciplineId: PredictionsHubSportDisciplineId;
  streamUrl?: string;
  isBettingAvailable: boolean;
  team1: SportHubMatchTeam;
  team2: SportHubMatchTeam;
  status: EsportsMatchStatus;
  sportDetail?: HubMatchHubDetail;
};
