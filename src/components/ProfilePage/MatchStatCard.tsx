import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import type { MatchStat } from "@/shared/types/profile";

const ICONS = {
  won: <ArrowUp className="size-5 text-main-success" strokeWidth={2.5} />,
  lost: <ArrowDown className="size-5 text-main-red" strokeWidth={2.5} />,
  pending: <RefreshCw className="size-5 text-main-purple" strokeWidth={2.5} />,
} as const;

export function MatchStatCard({ stat }: { stat: MatchStat }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-2 rounded-sm bg-main-lightGray p-3">
      <span className="text-xs font-normal text-main-darkPurple/60 leading-4">{stat.label}</span>
      <div className="flex items-center gap-1.5">
        {ICONS[stat.kind]}
        <span className="text-main-darkPurple text-md tabular-nums leading-6">{stat.value}</span>
      </div>
    </div>
  );
}
