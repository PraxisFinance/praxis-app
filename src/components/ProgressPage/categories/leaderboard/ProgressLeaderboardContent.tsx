"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  ProgressLeaderboardUserRow,
  progressLeaderboardLevelColumnClassName,
  progressLeaderboardNicknameColumnClassName,
  progressLeaderboardPlaceColumnClassName,
  progressLeaderboardPointsColumnClassName,
  progressLeaderboardRowLayoutClassName,
} from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardUserRow";
import { cn } from "@/lib/utils";
import type { ProgressLeaderboardEntry } from "@/stores/progress/leaderboard/types";

export interface ProgressLeaderboardContentProps {
  entries: ProgressLeaderboardEntry[];
  userEntry: ProgressLeaderboardEntry | null;
}

export function ProgressLeaderboardContent({
  entries,
  userEntry,
}: ProgressLeaderboardContentProps) {
  const hasRows = userEntry != null || entries.length > 0;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple">Leaderboard</SectionHeader>

      {hasRows ? (
        <div className="flex flex-col gap-2">
          <div className={cn(progressLeaderboardRowLayoutClassName, "px-3 py-0")}>
            <span
              className={cn(
                progressLeaderboardPlaceColumnClassName,
                "text-text-11 text-main-darkPurple/55"
              )}
            >
              Place
            </span>
            <span
              className={cn(
                progressLeaderboardNicknameColumnClassName,
                "text-text-11 text-main-darkPurple/55"
              )}
            >
              Nickname
            </span>
            <span
              className={cn(
                progressLeaderboardLevelColumnClassName,
                "text-text-11 text-main-darkPurple/55"
              )}
            >
              Account LvL
            </span>
            <span
              className={cn(
                progressLeaderboardPointsColumnClassName,
                "text-text-11 text-main-darkPurple/55"
              )}
            >
              Points earned
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {userEntry != null ? (
              <li>
                <ProgressLeaderboardUserRow entry={userEntry} isCurrentUser />
              </li>
            ) : null}
            {entries.map((entry) => (
              <li key={entry.id}>
                <ProgressLeaderboardUserRow entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
          No leaderboard entries yet.
        </p>
      )}
    </section>
  );
}
