"use client";

import { useMemo } from "react";
import { ProgressHubFilter } from "@/components/ProgressPage/ProgressHubFilter";
import { ProgressAchievementsPanel } from "@/components/ProgressPage/categories/achievements/ProgressAchievementsPanel";
import { ProgressAchievementHistoryPanel } from "@/components/ProgressPage/categories/history/ProgressAchievementHistoryPanel";
import { ProgressLeaderboardPanel } from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardPanel";
import { ProgressQuestsPanel } from "@/components/ProgressPage/categories/quests/ProgressQuestsPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useProgressDataSync, useProgressHubCategory } from "@/hooks/progress";
import { PROGRESS_HUB_CATEGORY_FILTERS } from "@/shared/constants/progressHubFilters";

export function ProgressHubPage() {
  useProgressDataSync();
  const { activeCategoryId, changeCategory } = useProgressHubCategory();

  const sectionTitle = useMemo(() => {
    const activeCategory = PROGRESS_HUB_CATEGORY_FILTERS.find(
      (category) => category.id === activeCategoryId,
    );
    return activeCategory?.title;
  }, [activeCategoryId]);

  return (
    <div className="flex flex-col gap-6">
      <ProgressHubFilter value={activeCategoryId} onChange={changeCategory} />
      {sectionTitle != null ? <SectionHeader>{sectionTitle}</SectionHeader> : null}
      {activeCategoryId === "achievements" ? <ProgressAchievementsPanel /> : null}
      {activeCategoryId === "leaderboard" ? <ProgressLeaderboardPanel /> : null}
      {activeCategoryId === "achievement-history" ? <ProgressAchievementHistoryPanel /> : null}
      {activeCategoryId === "quests" ? <ProgressQuestsPanel /> : null}
    </div>
  );
}
