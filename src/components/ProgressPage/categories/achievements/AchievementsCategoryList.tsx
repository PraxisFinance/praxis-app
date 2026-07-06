"use client";

import { useMemo, useState } from "react";
import { AchievementsCategoryPanel } from "@/components/ProgressPage/categories/achievements/AchievementsCategoryPanel";
import { selectAchievementCategories } from "@/stores/progress/achievements/selectors";
import { useProgressStore } from "@/stores/progress/store";
import type { AchievementCategoryId } from "@/shared/types/achievements";

export function AchievementsCategoryList() {
  const definitions = useProgressStore((state) => state.definitions);
  const userAchievements = useProgressStore((state) => state.userAchievements);
  const categories = useMemo(
    () => selectAchievementCategories({ definitions, userAchievements }),
    [definitions, userAchievements],
  );
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<AchievementCategoryId>>(new Set());

  function toggleCategory(id: AchievementCategoryId) {
    setOpenCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
          isOpen={openCategoryIds.has(category.id)}
          onToggle={() => toggleCategory(category.id)}
        />
      ))}
    </div>
  );
}
