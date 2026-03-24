"use client";

import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";

interface EsportOddsChipProps {
  side: "T1" | "T2";
  odds: number;
}

export function EsportOddsChip({ side, odds }: EsportOddsChipProps) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-lg bg-main-grayPurple px-3 py-2.5">
      <span className="text-main-darkPurple text-xs font-semibold">{side}</span>
      <span className="text-main-darkPurple text-sm font-semibold tabular-nums">
        {formatEsportsOdds(odds)}
      </span>
    </div>
  );
}
