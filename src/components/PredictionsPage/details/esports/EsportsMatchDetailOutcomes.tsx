"use client";

import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { HubMatchDetailOutcomes } from "../shared/match/HubMatchDetailOutcomes";

interface EsportsMatchDetailOutcomesProps {
  match: EsportsMatch;
  team1PoolPercent: number;
  team2PoolPercent: number;
  onPickTeam?: (side: "team1" | "team2") => void;
}

export function EsportsMatchDetailOutcomes(props: EsportsMatchDetailOutcomesProps) {
  return <HubMatchDetailOutcomes {...props} />;
}
