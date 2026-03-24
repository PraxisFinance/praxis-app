"use client";

import Image from "next/image";
import { format } from "date-fns";
import type { EsportsMatch, EsportsMatchStatus } from "@/shared/types/esportsMatch";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import { cn } from "@/lib/utils";

const TEAM_LOGO_FALLBACK = "/icons/question.png";
const STREAM_LINK_ICON = "/icons/online-link.png";

function formatOdds(value: number): string {
  return String(parseFloat(value.toFixed(2)));
}

function getStatusLine(status: EsportsMatchStatus): { text: string; showLiveDot: boolean } {
  switch (status.kind) {
    case "live":
      return { text: status.label ?? "Live now", showLiveDot: true };
    case "upcoming":
      return {
        text:
          status.label ??
          (status.startsAt
            ? format(new Date(status.startsAt), "MMM d · HH:mm")
            : "Upcoming"),
        showLiveDot: false,
      };
    case "finished":
      return { text: status.label ?? "Final", showLiveDot: false };
  }
}

interface EsportMatchCardProps {
  match: EsportsMatch;
}

export function EsportMatchCard({ match }: EsportMatchCardProps) {
  const game = ESPORTS_GAMES.find((g) => g.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";
  const { team1, team2 } = match;
  const statusLine = getStatusLine(match.status);
  const hasScores = team1.score !== undefined && team2.score !== undefined;

  return (
    <article className="flex w-full flex-col gap-4 rounded-[10px] bg-main-lightGray p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="relative h-7 w-7 shrink-0">
          {gameIconUrl ? (
            <Image src={gameIconUrl} alt="" width={28} height={28} className="object-contain" />
          ) : (
            <span className="block h-7 w-7 rounded-md bg-main-grayPurple/40" aria-hidden />
          )}
        </div>
        {match.streamUrl ? (
          <a
            href={match.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-main-grayPurple transition-opacity hover:opacity-90"
            aria-label="Open stream"
          >
            <Image
              src={STREAM_LINK_ICON}
              alt=""
              width={20}
              height={20}
              className="object-contain"
            />
          </a>
        ) : (
          <span className="h-8 w-8 shrink-0" aria-hidden />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <TeamBlock name={team1.name} logoUrl={team1.logoUrl} />
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 px-1">
          <div className="flex items-center gap-1.5">
            {statusLine.showLiveDot && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-main-red" aria-hidden />
            )}
            <span className="text-main-darkPurple text-2xs font-medium leading-tight">
              {statusLine.text}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ScoreBox value={hasScores ? team1.score : undefined} />
            <ScoreBox value={hasScores ? team2.score : undefined} />
          </div>
        </div>
        <TeamBlock name={team2.name} logoUrl={team2.logoUrl} />
      </div>

      <div className="flex gap-2">
        <OddsChip side="T1" odds={team1.odds} />
        <OddsChip side="T2" odds={team2.odds} />
      </div>
    </article>
  );
}

function ScoreBox({ value }: { value: number | undefined }) {
  return (
    <span
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold",
        value === undefined
          ? "bg-main-white/80 text-main-darkPurple/50"
          : "bg-main-white text-main-darkPurple"
      )}
    >
      {value ?? "—"}
    </span>
  );
}

function TeamBlock({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string;
}) {
  const src = logoUrl || TEAM_LOGO_FALLBACK;
  return (
    <div className="flex max-w-[36%] min-w-0 flex-1 flex-col items-center gap-2">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-main-white">
        <Image src={src} alt="" fill className="object-cover" sizes="56px" />
      </div>
      <p className="text-main-darkPurple w-full truncate text-center text-2xs font-medium leading-tight">
        {name}
      </p>
    </div>
  );
}

function OddsChip({ side, odds }: { side: "T1" | "T2"; odds: number }) {
  return (
    <div className="bg-main-white flex flex-1 items-center justify-between rounded-lg px-3 py-2.5">
      <span className="text-main-darkPurple text-xs font-semibold">{side}</span>
      <span className="text-main-darkPurple text-sm font-semibold tabular-nums">
        {formatOdds(odds)}
      </span>
    </div>
  );
}
