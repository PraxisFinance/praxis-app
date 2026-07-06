"use client";

import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import {
  getSportMatchStatusLine,
  getSportMatchUpcomingDateLabel,
  getSportMatchUpcomingTimeLabel,
} from "@/shared/utils/sportMatchFormat";
import {
  SportMatchHubDisciplineIcon,
  SportMatchHubOddsChip,
  SportMatchHubScoreBox,
  SportMatchHubStreamButton,
  SportMatchHubTeamBlock,
} from "./sport";
import { useLiveSportScore } from "@/hooks/useLiveMatchScore";

interface SportMatchHubCardProps {
  match: SportHubMatch;
  onPickTeam?: (side: "team1" | "team2") => void;
}

export function SportMatchHubCard({ match, onPickTeam }: SportMatchHubCardProps) {
  const { participantA, participantB } = match;
  const statusLine = getSportMatchStatusLine(match.status);
  const liveScore = useLiveSportScore(match.externalMatchId);
  const scoreA = liveScore?.scoreA ?? participantA.score;
  const scoreB = liveScore?.scoreB ?? participantB.score;
  const hasScores = scoreA !== undefined && scoreB !== undefined;
  const bettingDisabled = !match.isTradingOpen;

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-4 rounded-[10px] p-3">
      <div className="flex w-full items-stretch gap-2">
        <div className="flex shrink-0 flex-col items-center justify-start">
          <SportMatchHubDisciplineIcon disciplineId={match.disciplineId} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <SportMatchHubTeamBlock name={participantA.name} logoUrl={participantA.logoUrl} />
        </div>

        <div className="flex min-w-0 shrink flex-col items-center justify-end gap-2 self-stretch px-1 pb-5">
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
                <SportMatchHubScoreBox value={hasScores ? scoreA : undefined} />
                <SportMatchHubScoreBox value={hasScores ? scoreB : undefined} />
              </div>
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <SportMatchHubTeamBlock name={participantB.name} logoUrl={participantB.logoUrl} />
        </div>

        <div className="flex shrink-0 flex-col items-center justify-start">
          <SportMatchHubStreamButton streamUrl={match.streamUrl} />
        </div>
      </div>

      <div className="flex gap-2">
        <SportMatchHubOddsChip
          side="T1"
          teamName={participantA.name}
          odds={participantA.odds}
          disabled={bettingDisabled}
          onPress={onPickTeam ? () => onPickTeam("team1") : undefined}
        />
        <SportMatchHubOddsChip
          side="T2"
          teamName={participantB.name}
          odds={participantB.odds}
          disabled={bettingDisabled}
          onPress={onPickTeam ? () => onPickTeam("team2") : undefined}
        />
      </div>
    </article>
  );
}
