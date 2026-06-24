"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressHubFilter } from "@/components/ProgressPage/ProgressHubFilter";
import { ProgressAchievementsPanel } from "@/components/ProgressPage/categories/achievements/ProgressAchievementsPanel";
import { ProgressAchievementHistoryPanel } from "@/components/ProgressPage/categories/history/ProgressAchievementHistoryPanel";
import { ProgressLeaderboardPanel } from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardPanel";
import { ProgressQuestsPanel } from "@/components/ProgressPage/categories/quests/ProgressQuestsPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buildProgressHubRoute } from "@/lib/routes";
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
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<ProgressHubCategoryId>(initialCategoryId);

  useEffect(() => {
    setCategoryId((prev) => (prev === initialCategoryId ? prev : initialCategoryId));
  }, [initialCategoryId]);

  function handleCategoryChange(nextCategoryId: ProgressHubCategoryId) {
    setCategoryId(nextCategoryId);
    router.replace(buildProgressHubRoute(nextCategoryId), { scroll: false });
  }

  const sectionTitle = useMemo(() => {
    const activeCategory = PROGRESS_HUB_CATEGORY_FILTERS.find(
      (category) => category.id === categoryId,
    );
    return activeCategory?.title;
  }, [categoryId]);

  return (
    <div className="flex flex-col gap-6">
      <ProgressHubFilter value={categoryId} onChange={handleCategoryChange} />
      {sectionTitle != null ? <SectionHeader>{sectionTitle}</SectionHeader> : null}
      {categoryId === "achievements" ? <ProgressAchievementsPanel /> : null}
      {categoryId === "leaderboard" ? <ProgressLeaderboardPanel /> : null}
      {categoryId === "achievement-history" ? <ProgressAchievementHistoryPanel /> : null}
      {categoryId === "quests" ? <ProgressQuestsPanel /> : null}
    </div>
  );
}
