"use client";

import { AchievementsCommonStats } from "@/components/ProgressPage/categories/achievements/AchievementsCommonStats";
import { ProgressLeaderboardContent } from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardContent";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useProgressStore } from "@/stores/progress/store";
import { selectUserProgressStats } from "@/stores/progress/achievements/selectors";

export function ProgressLeaderboardPanel() {
  const stats = useProgressStore(selectUserProgressStats);
  const entries = useProgressStore((state) => state.entries);
  const userEntry = useProgressStore((state) => state.userEntry);
  const loading = useProgressStore((state) => state.loading);
  const error = useProgressStore((state) => state.error);

  if (loading) {
    return <PageSkeleton variant="list" rows={5} />;
  }

  if (error != null) {
    return (
      <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">{error}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {stats != null ? (
        <AchievementsCommonStats
          level={stats.level}
          currentXp={stats.currentXp}
          xpToNextLevel={stats.xpToNextLevel}
          description={stats.description ?? ""}
        />
      ) : null}

      <ProgressLeaderboardContent entries={entries} userEntry={userEntry} />
    </div>
  );
}
