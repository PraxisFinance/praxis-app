"use client";

import Image from "next/image";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import {
  getEsportsMatchStatusLine,
  getEsportsUpcomingDateLabel,
  getEsportsUpcomingTimeLabel,
} from "@/shared/utils/esportsMatchFormat";
import { EsportOddsChip } from "./EsportOddsChip";
import { EsportScoreBox } from "./EsportScoreBox";
import { EsportStreamButton } from "./EsportStreamButton";
import { EsportTeamBlock } from "./EsportTeamBlock";

interface EsportMatchCardProps {
  match: EsportsMatch;
}

export function EsportMatchCard({ match }: EsportMatchCardProps) {
  const game = ESPORTS_GAMES.find((g) => g.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";
  const { team1, team2 } = match;
  const statusLine = getEsportsMatchStatusLine(match.status);
  const hasScores = team1.score !== undefined && team2.score !== undefined;

  return (
    <article className="flex w-full flex-col gap-4 rounded-[10px] bg-main-lightGray p-3">
      <div className="flex w-full items-stretch gap-2">
        <div className="flex shrink-0 flex-col items-center justify-start">
          <div className="relative h-7 w-7 shrink-0">
            {gameIconUrl ? (
              <Image src={gameIconUrl} alt="" width={28} height={28} className="object-contain" />
            ) : (
              <span className="block h-7 w-7 rounded-md bg-main-grayPurple" aria-hidden />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <EsportTeamBlock name={team1.name} logoUrl={team1.logoUrl} />
        </div>

        <div className="flex min-w-0 shrink flex-col items-center justify-end gap-2 self-stretch px-1 pb-5">
          {match.status.kind === "upcoming" ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-main-darkPurple text-center text-2xs font-medium leading-tight">
                {getEsportsUpcomingDateLabel(match.status.startsAt, match.status.label)}
              </span>
              <span className="text-main-darkPurple text-center text-md font-normal leading-tight tabular-nums">
                {getEsportsUpcomingTimeLabel(match.status.startsAt)}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1.5">
                {statusLine?.showLiveDot && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-main-red" aria-hidden />
                )}
                <span className="text-main-darkPurple text-center text-2xs font-medium leading-tight">
                  {statusLine?.text ?? ""}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <EsportScoreBox value={hasScores ? team1.score : undefined} />
                <EsportScoreBox value={hasScores ? team2.score : undefined} />
              </div>
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <EsportTeamBlock name={team2.name} logoUrl={team2.logoUrl} />
        </div>

        <div className="flex shrink-0 flex-col items-center justify-start">
          <EsportStreamButton streamUrl={match.streamUrl} />
        </div>
      </div>

      <div className="flex gap-2">
        <EsportOddsChip side="T1" teamName={team1.name} odds={team1.odds} />
        <EsportOddsChip side="T2" teamName={team2.name} odds={team2.odds} />
      </div>
    </article>
  );
}
