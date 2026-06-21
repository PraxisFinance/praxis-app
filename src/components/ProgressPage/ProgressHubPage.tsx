"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressHubFilter } from "@/components/ProgressPage/ProgressHubFilter";
import { ProgressAchievementsPanel } from "@/components/ProgressPage/categories/ProgressAchievementsPanel";
import { ProgressQuestsPanel } from "@/components/ProgressPage/categories/ProgressQuestsPanel";
import { HistoryPage } from "@/components/HistoryPage";
import { LeaderboardPage } from "@/components/LeaderboardPage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  DEFAULT_PROGRESS_HUB_CATEGORY_ID,
  PROGRESS_HUB_CATEGORY_FILTERS,
  type ProgressHubCategoryId,
} from "@/shared/constants/progressHubFilters";

export interface ProgressHubPageProps {
  /** Preset category filter when the page opens or when the prop changes. */
  initialCategoryId?: ProgressHubCategoryId;
}

export function ProgressHubPage({
  initialCategoryId = DEFAULT_PROGRESS_HUB_CATEGORY_ID,
}: ProgressHubPageProps) {
  const [categoryId, setCategoryId] = useState<ProgressHubCategoryId>(initialCategoryId);

  useEffect(() => {
    setCategoryId((prev) => (prev === initialCategoryId ? prev : initialCategoryId));
  }, [initialCategoryId]);

  const sectionTitle = useMemo(() => {
    const activeCategory = PROGRESS_HUB_CATEGORY_FILTERS.find(
      (category) => category.id === categoryId,
    );
    return activeCategory?.title;
  }, [categoryId]);

  return (
    <div className="flex flex-col gap-6">
      <ProgressHubFilter value={categoryId} onChange={setCategoryId} />
      {sectionTitle != null ? <SectionHeader>{sectionTitle}</SectionHeader> : null}
      {categoryId === "achievements" ? <ProgressAchievementsPanel /> : null}
      {categoryId === "leaderboard" ? <LeaderboardPage embedded /> : null}
      {categoryId === "history" ? <HistoryPage /> : null}
      {categoryId === "quests" ? <ProgressQuestsPanel /> : null}
    </div>
  );
}
