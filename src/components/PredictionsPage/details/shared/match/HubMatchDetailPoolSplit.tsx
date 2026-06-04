"use client";

import { Users } from "lucide-react";
import { formatHubDetailPoolPercent } from "../hubDetailFormat";
import {
  HUB_MATCH_DETAIL_TEAM1_COLOR,
  HUB_MATCH_DETAIL_TEAM2_COLOR,
} from "./hubMatchDetailTheme";

interface HubMatchDetailPoolSplitProps {
  team1PoolPercent: number;
  team2PoolPercent: number;
}

export function HubMatchDetailPoolSplit({
  team1PoolPercent,
  team2PoolPercent,
}: HubMatchDetailPoolSplitProps) {
  const team1Width = Math.min(100, Math.max(0, team1PoolPercent));

  return (
    <div className="flex items-center gap-2">
      <Users className="text-main-darkPurple/45 size-4 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full shrink-0 rounded-l-full"
            style={{ width: `${team1Width}%`, backgroundColor: HUB_MATCH_DETAIL_TEAM1_COLOR }}
          />
          <div
            className="h-full flex-1 rounded-r-full"
            style={{ backgroundColor: HUB_MATCH_DETAIL_TEAM2_COLOR }}
          />
        </div>
        <div className="flex items-center justify-between text-2xs font-semibold tabular-nums">
          <span style={{ color: HUB_MATCH_DETAIL_TEAM1_COLOR }}>
            T1 {formatHubDetailPoolPercent(team1PoolPercent)}
          </span>
          <span style={{ color: HUB_MATCH_DETAIL_TEAM2_COLOR }}>
            T2 {formatHubDetailPoolPercent(team2PoolPercent)}
          </span>
        </div>
      </div>
    </div>
  );
}
