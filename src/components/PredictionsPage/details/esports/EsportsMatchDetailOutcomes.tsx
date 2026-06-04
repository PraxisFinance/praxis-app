"use client";

import { Flame } from "lucide-react";
import { HintIcon } from "@/components/icons/base";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { cn } from "@/lib/utils";
import { EsportsMatchDetailPoolSplit } from "./EsportsMatchDetailPoolSplit";
import {
  ESPORTS_DETAIL_TEAM1_COLOR,
  ESPORTS_DETAIL_TEAM2_COLOR,
} from "./esportsDetailTheme";

interface EsportsMatchDetailOutcomesProps {
  match: EsportsMatch;
  team1PoolPercent: number;
  team2PoolPercent: number;
  onPickTeam?: (side: "team1" | "team2") => void;
}

const outcomeButtonClassName =
  "relative flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-lg bg-main-grayPurple px-3 py-3 text-left outline-none transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-45";

export function EsportsMatchDetailOutcomes({
  match,
  team1PoolPercent,
  team2PoolPercent,
  onPickTeam,
}: EsportsMatchDetailOutcomesProps) {
  const { team1, team2 } = match;
  const disabled = !match.isBettingAvailable;

  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center gap-1.5">
        <Flame className="text-main-purple size-4 shrink-0" aria-hidden />
        <h2 className="text-main-darkPurple text-sm font-medium">Outcomes</h2>
        <button
          type="button"
          className="text-main-darkPurple/45 hover:text-main-darkPurple/70 ml-0.5 inline-flex"
          aria-label="How outcomes work"
        >
          <HintIcon className="size-3.5" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled}
          className={cn(outcomeButtonClassName)}
          onClick={() => onPickTeam?.("team1")}
        >
          <span
            className="absolute top-0 bottom-0 left-0 w-1"
            style={{ backgroundColor: ESPORTS_DETAIL_TEAM1_COLOR }}
            aria-hidden
          />
          <span className="text-main-darkPurple relative min-w-0 truncate text-xs font-semibold">
            {team1.name}
          </span>
          <span className="text-main-darkPurple relative shrink-0 text-sm font-semibold tabular-nums">
            {formatEsportsOdds(team1.odds)}
          </span>
        </button>

        <button
          type="button"
          disabled={disabled}
          className={cn(outcomeButtonClassName)}
          onClick={() => onPickTeam?.("team2")}
        >
          <span
            className="absolute top-0 right-0 bottom-0 w-1"
            style={{ backgroundColor: ESPORTS_DETAIL_TEAM2_COLOR }}
            aria-hidden
          />
          <span className="text-main-darkPurple relative min-w-0 truncate text-xs font-semibold">
            {team2.name}
          </span>
          <span className="text-main-darkPurple relative shrink-0 text-sm font-semibold tabular-nums">
            {formatEsportsOdds(team2.odds)}
          </span>
        </button>
      </div>

      <EsportsMatchDetailPoolSplit
        team1PoolPercent={team1PoolPercent}
        team2PoolPercent={team2PoolPercent}
      />
    </section>
  );
}
