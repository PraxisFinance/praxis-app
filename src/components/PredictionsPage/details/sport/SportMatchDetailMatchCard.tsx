"use client";

import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import {
  getSportMatchStatusLine,
  getSportMatchUpcomingDateLabel,
  getSportMatchUpcomingTimeLabel,
} from "@/shared/utils/sportMatchFormat";
import {
  SportMatchHubDisciplineIcon,
  SportMatchHubScoreBox,
  SportMatchHubStreamButton,
  SportMatchHubTeamBlock,
} from "@/components/PredictionsPage/cards/sport";

interface SportMatchDetailMatchCardProps {
  match: SportHubMatch;
  displayTitle: string;
}

export function SportMatchDetailMatchCard({ match, displayTitle }: SportMatchDetailMatchCardProps) {
  const { team1, team2 } = match;
  const statusLine = getSportMatchStatusLine(match.status);
  const hasScores = team1.score !== undefined && team2.score !== undefined;

  return (
    <section className="bg-main-lightGray relative flex flex-col gap-4 rounded-[10px] p-3">
      <div className="absolute top-3 left-3">
        <SportMatchHubDisciplineIcon disciplineId={match.disciplineId} />
      </div>
      <div className="absolute top-3 right-3">
        <SportMatchHubStreamButton streamUrl={match.streamUrl} />
      </div>

      <h1 className="text-main-darkPurple px-8 pt-1 text-center text-base leading-snug font-semibold">
        {displayTitle}
      </h1>

      <div className="flex w-full items-stretch gap-2">
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <SportMatchHubTeamBlock name={team1.name} logoUrl={team1.logoUrl} />
        </div>

        <div className="flex min-w-0 shrink flex-col items-center justify-center gap-2 self-stretch px-1">
          {match.status.kind === "upcoming" ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-main-darkPurple text-center text-2xs font-medium leading-tight">
                {getSportMatchUpcomingDateLabel(match.status.startsAt, match.status.label)}
              </span>
              <span className="text-main-darkPurple text-md text-center font-normal leading-tight tabular-nums">
                {getSportMatchUpcomingTimeLabel(match.status.startsAt)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1.5">
                {statusLine?.showLiveDot ? (
                  <span className="bg-main-red h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
                ) : null}
                <span className="text-main-darkPurple text-center text-2xs font-medium leading-tight">
                  {statusLine?.text ?? ""}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <SportMatchHubScoreBox value={hasScores ? team1.score : undefined} />
                <SportMatchHubScoreBox value={hasScores ? team2.score : undefined} />
              </div>
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <SportMatchHubTeamBlock name={team2.name} logoUrl={team2.logoUrl} />
        </div>
      </div>
    </section>
  );
}
