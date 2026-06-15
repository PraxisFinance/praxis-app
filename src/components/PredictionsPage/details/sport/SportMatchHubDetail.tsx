"use client";

import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import {
  HubMatchDetailOutcomes,
  HubMatchDetailProbabilityChart,
} from "../shared/match";
import { SportMatchDetailMatchCard } from "./SportMatchDetailMatchCard";
import { SportMatchDetailResolution } from "./SportMatchDetailResolution";

interface SportMatchHubDetailProps {
  match: SportHubMatch;
  onPickTeam?: (side: "team1" | "team2") => void;
}

export function SportMatchHubDetail({ match, onPickTeam }: SportMatchHubDetailProps) {
  const detail = match.detail;

  if (!detail) {
    return (
      <p className="text-main-darkPurple/60 text-sm">Detail data is not available for this match.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <SportMatchDetailMatchCard match={match} displayTitle={detail.displayTitle} />
      <HubMatchDetailProbabilityChart
        volumeLabel={detail.volumeLabel ?? ""}
        points={detail.chartPoints}
        team1={match.participantA}
        team2={match.participantB}
      />
      <HubMatchDetailOutcomes
        match={match}
        team1PoolPercent={detail.participantAPoolPercent}
        team2PoolPercent={detail.participantBPoolPercent}
        onPickTeam={onPickTeam}
      />
      <SportMatchDetailResolution
        clubName={match.participantA.name}
        opponentName={match.participantB.name}
        resolutionDeadlineLabel={detail.resolutionDeadlineLabel}
      />
    </div>
  );
}
