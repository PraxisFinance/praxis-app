"use client";

import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";

interface EsportOddsChipProps {
  /** Kept for API / future layout refactor; also exposed as `data-side`. */
  side: "T1" | "T2";
  teamName: string;
  odds: number;
}

export function EsportOddsChip({ side, teamName, odds }: EsportOddsChipProps) {
  return (
    <div
      className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg bg-main-grayPurple px-3 py-2.5"
      data-side={side}
    >
      <span className="text-main min-w-0 truncate text-xs">
        {teamName}
      </span>
      <span className="text-main shrink-0 text-sm tabular-nums">
        {formatEsportsOdds(odds)}
      </span>
    </div>
  );
}
