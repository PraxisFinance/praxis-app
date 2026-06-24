"use client";

import { useState } from "react";
import { AchievementsCategoryPanel } from "@/components/ProgressPage/categories/achievements/AchievementsCategoryPanel";
import { ACHIEVEMENT_CATEGORIES_MOCK } from "@/shared/constants/achievements";
import type { AchievementCategoryId } from "@/shared/types/achievements";

export function AchievementsCategoryList() {
  const [openCategoryId, setOpenCategoryId] = useState<AchievementCategoryId | null>(null);

  function toggleCategory(id: AchievementCategoryId) {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2">
      {ACHIEVEMENT_CATEGORIES_MOCK.map((category) => (
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
