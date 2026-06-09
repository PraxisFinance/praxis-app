"use client";

import type { SportHubMatch, SportHubMatchTeam } from "@/shared/types/sportHubMatch";
import { formatSportMatchOdds } from "@/shared/utils/sportMatchFormat";
import { SportMatchHubDisciplineIcon } from "@/components/PredictionsPage/cards/sport/SportMatchHubDisciplineIcon";
import { SportMatchDrawerTeamInline } from "./SportMatchDrawerTeamInline";

interface SportMatchDrawerOutcomeCardProps {
  match: SportHubMatch;
  selectedTeam: SportHubMatchTeam;
}

export function SportMatchDrawerOutcomeCard({
  match,
  selectedTeam,
}: SportMatchDrawerOutcomeCardProps) {
  return (
    <div className="bg-main-grayPurple/80 flex flex-col gap-2 rounded-[10px] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-main-darkPurple min-w-0 text-sm leading-snug font-semibold">
          Match outcome: {selectedTeam.name}
        </p>
        <span className="text-main-darkPurple shrink-0 text-sm font-semibold tabular-nums">
          {formatSportMatchOdds(selectedTeam.odds)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <SportMatchDrawerTeamInline team={match.team1} />
          <span className="text-main-darkPurple/50 shrink-0 text-xs font-medium">—</span>
          <SportMatchDrawerTeamInline team={match.team2} />
        </div>
        <SportMatchHubDisciplineIcon disciplineId={match.disciplineId} />
      </div>
    </div>
  );
}
