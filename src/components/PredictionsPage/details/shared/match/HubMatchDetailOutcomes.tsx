"use client";

import { OutcomesIcon } from "@/components/icons/feature/predictions/OutcomesIcon";
import { HintIcon } from "@/components/icons/base";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import type { HubMatchForDetailOutcomes } from "@/shared/types/hubMatchDetail";
import { cn } from "@/lib/utils";
import { HubMatchDetailPoolSplit } from "./HubMatchDetailPoolSplit";
import {
  HUB_MATCH_DETAIL_TEAM1_COLOR,
  HUB_MATCH_DETAIL_TEAM2_COLOR,
} from "./hubMatchDetailTheme";

interface HubMatchDetailOutcomesProps {
  match: HubMatchForDetailOutcomes;
  team1PoolPercent: number;
  team2PoolPercent: number;
  onPickTeam?: (side: "team1" | "team2") => void;
}

const outcomeButtonClassName =
  "relative flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden rounded-lg bg-main-grayPurple px-3 py-3 text-left outline-none transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-45";

export function HubMatchDetailOutcomes({
  match,
  team1PoolPercent,
  team2PoolPercent,
  onPickTeam,
}: HubMatchDetailOutcomesProps) {
  const { participantA, participantB } = match;
  const disabled = !match.isTradingOpen;

  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center gap-1.5">
        <OutcomesIcon className="size-4 shrink-0" aria-hidden />
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
            style={{ backgroundColor: HUB_MATCH_DETAIL_TEAM1_COLOR }}
            aria-hidden
          />
          <span className="text-main-darkPurple relative min-w-0 truncate text-xs font-semibold">
            {participantA.name}
          </span>
          <span className="text-main-darkPurple relative shrink-0 text-sm font-semibold tabular-nums">
            {formatEsportsOdds(participantA.odds)}
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
            style={{ backgroundColor: HUB_MATCH_DETAIL_TEAM2_COLOR }}
            aria-hidden
          />
          <span className="text-main-darkPurple relative min-w-0 truncate text-xs font-semibold">
            {participantB.name}
          </span>
          <span className="text-main-darkPurple relative shrink-0 text-sm font-semibold tabular-nums">
            {formatEsportsOdds(participantB.odds)}
          </span>
        </button>
      </div>

      <HubMatchDetailPoolSplit
        team1PoolPercent={team1PoolPercent}
        team2PoolPercent={team2PoolPercent}
      />
    </section>
  );
}
