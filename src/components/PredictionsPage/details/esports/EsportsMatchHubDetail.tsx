"use client";

import type { EsportsMatch } from "@/shared/types/esportsMatch";
import {
  hubDetailMatchDisplayTitle,
  hubDetailPoolPercentsFromOdds,
} from "../shared/hubDetailFormat";
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
  const displayTitle =
    detail?.displayTitle ??
    hubDetailMatchDisplayTitle(match.participantA.name, match.participantB.name);
  const [team1PoolPercent, team2PoolPercent] = detail
    ? [detail.participantAPoolPercent, detail.participantBPoolPercent]
    : hubDetailPoolPercentsFromOdds(match.participantA.odds, match.participantB.odds);

  return (
    <div className="flex flex-col gap-4">
      <EsportsMatchDetailMatchCard match={match} displayTitle={displayTitle} />
      {detail != null && (
        <EsportsMatchDetailProbabilityChart
          volumeLabel={detail.volumeLabel ?? ""}
          points={detail.chartPoints}
          team1={match.participantA}
          team2={match.participantB}
        />
      )}
      <EsportsMatchDetailOutcomes
        match={match}
        team1PoolPercent={team1PoolPercent}
        team2PoolPercent={team2PoolPercent}
        onPickTeam={onPickTeam}
      />
      {detail != null && <EsportsMatchDetailResolution match={match} />}
    </div>
  );
}
