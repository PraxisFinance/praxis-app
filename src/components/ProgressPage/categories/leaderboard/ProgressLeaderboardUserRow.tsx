import { formatScore } from "@/stores";
import { PraxisBtnIcon } from "@/components/icons/brand/praxisBtnIcon";
import type { ProgressLeaderboardEntry } from "@/stores/progress/leaderboard/types";

const scoreColumnClassName =
  "text-main-darkPurple flex min-w-[5.75rem] max-w-[7.5rem] shrink-0 flex-row items-center justify-start gap-2 text-left text-sm font-medium tabular-nums leading-normal sm:min-w-[6.5rem] sm:text-base";

const userRowClassName =
  "bg-main-lightGray flex flex-row items-center gap-3 rounded-lg px-3 py-2";

export interface ProgressLeaderboardUserRowProps {
  entry: Pick<ProgressLeaderboardEntry, "name" | "score">;
}

export function ProgressLeaderboardUserRow({ entry }: ProgressLeaderboardUserRowProps) {
  return (
    <div className={userRowClassName}>
      <div className="flex min-w-0 flex-1 flex-row items-center gap-2.5">
        <div className="bg-main-purple/40 size-8 shrink-0 rounded-full" />
        <span className="text-main-darkPurple truncate text-sm font-medium leading-normal sm:text-base">
          {entry.name}
        </span>
      </div>
      <div className={scoreColumnClassName}>
        <span className="inline-flex shrink-0" aria-hidden>
          <PraxisBtnIcon />
        </span>
        <span className="min-w-0">{formatScore(entry.score)}</span>
      </div>
    </div>
  );
}
