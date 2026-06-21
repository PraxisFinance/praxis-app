"use client";

import type { ComponentType } from "react";
import { ChevronDown } from "lucide-react";
import { AchievementItemRow } from "@/components/ProgressPage/categories/achievments/AchievementItemRow";
import {
  ActivityIcon,
  BonusIcon,
  CoreFlowIcon,
  MarketCoverageIcon,
  PerfomanceIcon,
  ReferalIcon,
  YieldPredictionsIcon,
} from "@/components/icons/progress/achievements";
import { getAchievementCategoryProgress } from "@/shared/constants/achievements";
import type { AchievementCategory, AchievementCategoryId } from "@/shared/types/achievements";
import { cn } from "@/lib/utils";

const ACHIEVEMENT_CATEGORY_ICONS: Record<AchievementCategoryId, ComponentType> = {
  "core-flow": CoreFlowIcon,
  referal: ReferalIcon,
  "market-coverage": MarketCoverageIcon,
  activity: ActivityIcon,
  "yield-predictions": YieldPredictionsIcon,
  perfomance: PerfomanceIcon,
  bonus: BonusIcon,
};

export interface AchievementsCategoryPanelProps {
  category: AchievementCategory;
  isOpen: boolean;
  onToggle: () => void;
}

export function AchievementsCategoryPanel({
  category,
  isOpen,
  onToggle,
}: AchievementsCategoryPanelProps) {
  const Icon = ACHIEVEMENT_CATEGORY_ICONS[category.id];
  const { completed, total } = getAchievementCategoryProgress(category);

  return (
    <div className="overflow-hidden rounded-sm bg-main-lightGray">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-3 py-3 text-left"
      >
        <span className="size-10 shrink-0 overflow-hidden rounded-sm" aria-hidden>
          <Icon />
        </span>

        <span className="text-header-5 text-main-darkPurple min-w-0 flex-1">{category.label}</span>

        <span className="text-text-6 text-main-darkPurple/70 shrink-0 tabular-nums">
          {completed}/{total}
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-main-darkPurple/50 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-2 px-3 pb-3">
          {category.achievements.map((item) => (
            <AchievementItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
