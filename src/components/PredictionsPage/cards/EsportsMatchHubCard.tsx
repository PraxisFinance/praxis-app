"use client";

import Image from "next/image";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import {
  getEsportsMatchStatusLine,
  getEsportsUpcomingDateLabel,
  getEsportsUpcomingTimeLabel,
} from "@/shared/utils/esportsMatchFormat";
import { EsportsMatchHubOddsChip } from "./esports/EsportsMatchHubOddsChip";
import { EsportsMatchHubScoreBox } from "./esports/EsportsMatchHubScoreBox";
import { EsportsMatchHubStreamButton } from "./esports/EsportsMatchHubStreamButton";
import { EsportsMatchHubTeamBlock } from "./esports/EsportsMatchHubTeamBlock";
import { useLiveEsportsScore } from "@/hooks/useLiveMatchScore";

interface EsportsMatchHubCardProps {
  match: EsportsMatch;
  onPickTeam?: (side: "team1" | "team2") => void;
}

export function EsportsMatchHubCard({ match, onPickTeam }: EsportsMatchHubCardProps) {
  const game = ESPORTS_GAMES.find((g) => g.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";
  const { participantA, participantB } = match;
  const statusLine = getEsportsMatchStatusLine(match.status);
  const liveScore = useLiveEsportsScore(match.externalMatchId);
  const scoreA = liveScore?.scoreA ?? participantA.score;
  const scoreB = liveScore?.scoreB ?? participantB.score;
  const hasScores = scoreA !== undefined && scoreB !== undefined;
  const bettingDisabled = !match.isTradingOpen;

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-4 rounded-[10px] p-3">
      <div className="flex w-full items-stretch gap-2">
        <div className="flex shrink-0 flex-col items-center justify-start">
          <div className="relative h-7 w-7 shrink-0">
            {gameIconUrl ? (
              <Image src={gameIconUrl} alt="" width={28} height={28} className="object-contain" />
            ) : (
              <span className="bg-main-grayPurple block h-7 w-7 rounded-md" aria-hidden />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <EsportsMatchHubTeamBlock name={participantA.name} logoUrl={participantA.logoUrl} />
        </div>

        <div className="flex min-w-0 shrink flex-col items-center justify-end gap-2 self-stretch px-1 pb-5">
          {match.status.kind === "upcoming" ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-main-darkPurple text-center text-2xs font-medium leading-tight">
                {getEsportsUpcomingDateLabel(match.status.startsAt, match.status.label)}
              </span>
              <span className="text-main-darkPurple text-md text-center font-normal leading-tight tabular-nums">
                {getEsportsUpcomingTimeLabel(match.status.startsAt)}
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
                <EsportsMatchHubScoreBox value={hasScores ? scoreA : undefined} />
                <EsportsMatchHubScoreBox value={hasScores ? scoreB : undefined} />
              </div>
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <EsportsMatchHubTeamBlock name={participantB.name} logoUrl={participantB.logoUrl} />
        </div>

        <div className="flex shrink-0 flex-col items-center justify-start">
          <EsportsMatchHubStreamButton streamUrl={match.streamUrl} />
        </div>
      </div>

      <div className="flex gap-2">
        <EsportsMatchHubOddsChip
          side="T1"
          teamName={participantA.name}
          odds={participantA.odds}
          disabled={bettingDisabled}
          onPress={onPickTeam ? () => onPickTeam("team1") : undefined}
        />
        <EsportsMatchHubOddsChip
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
