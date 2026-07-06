import { cn } from "@/lib/utils";
import type { ProgressLeaderboardEntry } from "@/stores/progress/leaderboard/types";

export const progressLeaderboardRowLayoutClassName = "flex items-center gap-2 px-3 py-2.5";

export const progressLeaderboardPlaceColumnClassName = "mr-5 w-9 shrink-0 tabular-nums";

export const progressLeaderboardNicknameColumnClassName =
  "flex min-w-0 flex-1 items-center gap-2";

export const progressLeaderboardLevelColumnClassName = "w-14 shrink-0 text-center tabular-nums";

export const progressLeaderboardPointsColumnClassName =
  "w-[4.5rem] shrink-0 text-right tabular-nums";

export interface ProgressLeaderboardUserRowProps {
  entry: Pick<ProgressLeaderboardEntry, "rank" | "name" | "accountLevel" | "score">;
  isCurrentUser?: boolean;
}

export function ProgressLeaderboardUserRow({
  entry,
  isCurrentUser = false,
}: ProgressLeaderboardUserRowProps) {
  const displayName = isCurrentUser ? "You" : entry.name;

  return (
    <div
      className={cn(
        progressLeaderboardRowLayoutClassName,
        "bg-main-lightGray rounded-lg",
        isCurrentUser && "bg-main-grayPurple/50",
      )}
    >
      <span className={cn(progressLeaderboardPlaceColumnClassName, "text-header-6 text-main-darkPurple")}>
        {entry.rank}
      </span>

      <div className={progressLeaderboardNicknameColumnClassName}>
        <div className="bg-main-purple/40 size-7 shrink-0 rounded-full" aria-hidden />
        <span className="text-header-6 text-main-darkPurple truncate">{displayName}</span>
      </div>

      <span className={cn(progressLeaderboardLevelColumnClassName, "text-header-6 text-main-darkPurple")}>
        {entry.accountLevel}
      </span>

      <span className={cn(progressLeaderboardPointsColumnClassName, "text-header-6 text-main-darkPurple")}>
        {entry.score}
      </span>
    </div>
  );
}
