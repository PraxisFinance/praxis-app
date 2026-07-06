"use client";

import { ProgressHubFilter } from "@/components/ProgressPage/ProgressHubFilter";
import { ProgressAchievementsPanel } from "@/components/ProgressPage/categories/achievements/ProgressAchievementsPanel";
import { ProgressAchievementHistoryPanel } from "@/components/ProgressPage/categories/history/ProgressAchievementHistoryPanel";
import { ProgressLeaderboardPanel } from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardPanel";
import { ProgressQuestsPanel } from "@/components/ProgressPage/categories/quests/ProgressQuestsPanel";
import { useProgressDataSync, useProgressHubCategory } from "@/hooks/progress";

export function ProgressHubPage() {
  useProgressDataSync();
  const { activeCategoryId, changeCategory } = useProgressHubCategory();

  return (
    <div className="flex flex-col gap-6">
      <ProgressHubFilter value={activeCategoryId} onChange={changeCategory} />
      {activeCategoryId === "achievements" ? <ProgressAchievementsPanel /> : null}
      {activeCategoryId === "leaderboard" ? <ProgressLeaderboardPanel /> : null}
      {activeCategoryId === "achievement-history" ? <ProgressAchievementHistoryPanel /> : null}
      {activeCategoryId === "quests" ? <ProgressQuestsPanel /> : null}
    </div>
  );
}
