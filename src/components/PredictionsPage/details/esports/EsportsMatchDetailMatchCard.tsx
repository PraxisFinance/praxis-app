"use client";

import Image from "next/image";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import { useLiveEsportsScore } from "@/hooks/useLiveMatchScore";
import {
  getEsportsMatchStatusLine,
  getEsportsUpcomingDateLabel,
  getEsportsUpcomingTimeLabel,
} from "@/shared/utils/esportsMatchFormat";
import { EsportsMatchHubScoreBox } from "@/components/PredictionsPage/cards/esports/EsportsMatchHubScoreBox";
import { EsportsMatchHubStreamButton } from "@/components/PredictionsPage/cards/esports/EsportsMatchHubStreamButton";
import { EsportsMatchHubTeamBlock } from "@/components/PredictionsPage/cards/esports/EsportsMatchHubTeamBlock";

interface EsportsMatchDetailMatchCardProps {
  match: EsportsMatch;
  displayTitle: string;
}

export function EsportsMatchDetailMatchCard({ match, displayTitle }: EsportsMatchDetailMatchCardProps) {
  const game = ESPORTS_GAMES.find((entry) => entry.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";
  const { participantA, participantB } = match;
  const statusLine = getEsportsMatchStatusLine(match.status);
  const liveScore = useLiveEsportsScore(match.externalMatchId);
  const scoreA = liveScore?.scoreA ?? participantA.score;
  const scoreB = liveScore?.scoreB ?? participantB.score;
  const hasScores = scoreA !== undefined && scoreB !== undefined;

  return (
    <section className="bg-main-lightGray relative flex flex-col gap-4 rounded-[10px] p-3">
      <div className="absolute top-3 left-3">
        <div className="relative h-7 w-7 shrink-0">
          {gameIconUrl ? (
            <Image src={gameIconUrl} alt="" width={28} height={28} className="object-contain" />
          ) : (
            <span className="bg-main-grayPurple block h-7 w-7 rounded-md" aria-hidden />
          )}
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <EsportsMatchHubStreamButton streamUrl={match.streamUrl} />
      </div>

      <h1 className="text-main-darkPurple px-8 pt-1 text-center text-base leading-snug font-semibold">
        {displayTitle}
      </h1>

      <div className="flex w-full items-stretch gap-2">
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <EsportsMatchHubTeamBlock name={participantA.name} logoUrl={participantA.logoUrl} />
        </div>

        <div className="flex min-w-0 shrink flex-col items-center justify-center gap-2 self-stretch px-1">
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
      </div>
    </section>
  );
}
