"use client";

import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { EsportsMatchDetailMatchCard } from "./EsportsMatchDetailMatchCard";
import { EsportsMatchDetailOutcomes } from "./EsportsMatchDetailOutcomes";
import { EsportsMatchDetailProbabilityChart } from "./EsportsMatchDetailProbabilityChart";
import { EsportsMatchDetailResolution } from "./EsportsMatchDetailResolution";

interface EsportsMatchHubDetailProps {
  match: EsportsMatch;
  onPickTeam?: (side: "team1" | "team2") => void;
}

export function EsportsMatchHubDetail({ match, onPickTeam }: EsportsMatchHubDetailProps) {
  const detail = match.detail;

  if (!detail) {
    return (
      <p className="text-main-darkPurple/60 text-sm">Detail data is not available for this match.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <EsportsMatchDetailMatchCard match={match} displayTitle={detail.displayTitle} />
      <EsportsMatchDetailProbabilityChart
        volumeLabel={detail.volumeLabel ?? ""}
        points={detail.chartPoints}
        team1={match.participantA}
        team2={match.participantB}
      />
      <EsportsMatchDetailOutcomes
        match={match}
        team1PoolPercent={detail.participantAPoolPercent}
        team2PoolPercent={detail.participantBPoolPercent}
        onPickTeam={onPickTeam}
      />
      <EsportsMatchDetailResolution match={match} />
    </div>
  );
}
