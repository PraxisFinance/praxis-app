"use client";

import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import {
  hubDetailMatchDisplayTitle,
  hubDetailPoolPercentsFromOdds,
} from "../shared/hubDetailFormat";
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
  const displayTitle =
    detail?.displayTitle ??
    hubDetailMatchDisplayTitle(match.participantA.name, match.participantB.name);
  const [team1PoolPercent, team2PoolPercent] = detail
    ? [detail.participantAPoolPercent, detail.participantBPoolPercent]
    : hubDetailPoolPercentsFromOdds(match.participantA.odds, match.participantB.odds);

  return (
    <div className="flex flex-col gap-4">
      <SportMatchDetailMatchCard match={match} displayTitle={displayTitle} />
      {detail != null && (
        <HubMatchDetailProbabilityChart
          volumeLabel={detail.volumeLabel ?? ""}
          points={detail.chartPoints}
          team1={match.participantA}
          team2={match.participantB}
        />
      )}
      <HubMatchDetailOutcomes
        match={match}
        team1PoolPercent={team1PoolPercent}
        team2PoolPercent={team2PoolPercent}
        onPickTeam={onPickTeam}
      />
      {detail != null && (
        <SportMatchDetailResolution
          clubName={match.participantA.name}
          opponentName={match.participantB.name}
          resolutionDeadlineLabel={detail.resolutionDeadlineLabel}
        />
      )}
    </div>
  );
}
