"use client";

import { useState } from "react";
import { AchievementsCategoryPanel } from "@/components/ProgressPage/categories/achievements/AchievementsCategoryPanel";
import { selectAchievementCategories } from "@/stores/progress/achievements/selectors";
import { useProgressStore } from "@/stores/progress/store";
import type { AchievementCategoryId } from "@/shared/types/achievements";

export function AchievementsCategoryList() {
  const categories = useProgressStore(selectAchievementCategories);
  const [openCategoryId, setOpenCategoryId] = useState<AchievementCategoryId | null>(null);

  function toggleCategory(id: AchievementCategoryId) {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  }

  if (categories.length === 0) {
    return (
      <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
        No achievements available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category) => (
        <AchievementsCategoryPanel
          key={category.id}
          category={category}
          isOpen={openCategoryId === category.id}
          onToggle={() => toggleCategory(category.id)}
        />
      ))}
    </div>
  );
}
