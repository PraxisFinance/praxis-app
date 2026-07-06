"use client";

import type { ComponentType } from "react";
import { ChevronDown } from "lucide-react";
import { AchievementItemRow } from "@/components/ProgressPage/categories/achievements/AchievementItemRow";
import {
  ActivityIcon,
  BonusIcon,
  CoreFlowIcon,
  MarketCoverageIcon,
  PerfomanceIcon,
  ReferalIcon,
  YieldPredictionsIcon,
} from "@/components/icons/progress/achievements";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  formatAchievementCategoryPercent,
  getAchievementCategoryCompletionPercent,
  getAchievementCategoryProgress,
  getAchievementCategoryTotalXp,
} from "@/shared/constants/achievements";
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
  const totalXp = getAchievementCategoryTotalXp(category);
  const completionPercent = getAchievementCategoryCompletionPercent(category);
  const remainingPercent = 100 - completionPercent;

  return (
    <div className="overflow-hidden rounded-sm bg-main-lightGray">
      <div className="flex flex-col gap-3 px-3 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="bg-main-white flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-sm">
            <Icon />
          </span>

          <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <span className="text-header-5 text-main-darkPurple min-w-0">{category.label}</span>
            <span className="text-header-5 text-main-darkPurple shrink-0 tabular-nums">
              {totalXp} XP
            </span>
          </div>

          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-main-darkPurple/50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        <div className="flex flex-col gap-1.5">
          <ProgressBar
            value={completionPercent}
            variant="live"
            className="h-1.5 bg-main-grayPurple/80"
          />
          <div className="relative flex items-center justify-between">
            <span className="text-text-6 text-main-success tabular-nums">
              {formatAchievementCategoryPercent(completionPercent)}
            </span>
            <span className="text-text-6 text-main-darkPurple absolute left-1/2 -translate-x-1/2 tabular-nums">
              {completed}/{total}
            </span>
            <span className="text-text-6 text-main-darkPurple/40 tabular-nums">
              {formatAchievementCategoryPercent(remainingPercent)}
            </span>
          </div>
        </div>
      </div>

      {isOpen ? (
        <div className="flex flex-col gap-2 bg-main-lightGray px-3 pb-3">
          {category.achievements.map((item) => (
            <AchievementItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
