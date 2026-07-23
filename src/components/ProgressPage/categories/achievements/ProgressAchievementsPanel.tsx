"use client";

import { AchievementsCommonStats } from "@/components/ProgressPage/categories/achievements/AchievementsCommonStats";
import { AchievementsCategoryList } from "@/components/ProgressPage/categories/achievements/AchievementsCategoryList";
import { SectionHeader } from "@/components/ui";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useProgressStore } from "@/stores/progress/store";
import { selectUserProgressStats } from "@/stores/progress/achievements/selectors";

export function ProgressAchievementsPanel() {
  const stats = useProgressStore(selectUserProgressStats);
  const definitionsLoading = useProgressStore((state) => state.definitionsLoading);
  const definitionsError = useProgressStore((state) => state.definitionsError);
  const catalogueReady = !definitionsLoading && definitionsError == null;

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

      <SectionHeader>Achievements</SectionHeader>

      {definitionsLoading ? <PageSkeleton variant="list" rows={4} /> : null}

      {definitionsError != null ? (
        <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
          {definitionsError}
        </p>
      ) : null}

      {catalogueReady ? <AchievementsCategoryList /> : null}
    </div>
  );
}
