"use client";

import type { ComponentType } from "react";
import { FilterChipButton } from "@/components/PredictionsPage/filters/FilterChipButton";
import {
  AchievmentsIcon,
  HistoryIcon,
  LeaderboardIcon,
  QuestIcon,
} from "@/components/icons/progress";
import type { ProgressCategoryIconProps } from "@/components/icons/progress/progressIconProps";
import {
  PROGRESS_HUB_CATEGORY_FILTERS,
  type ProgressHubCategoryId,
} from "@/shared/constants/progressHubFilters";
import { cn } from "@/lib/utils";

const PROGRESS_CATEGORY_ICONS: Record<
  ProgressHubCategoryId,
  ComponentType<ProgressCategoryIconProps>
> = {
  achievements: AchievmentsIcon,
  leaderboard: LeaderboardIcon,
  "achievement-history": HistoryIcon,
  quests: QuestIcon,
};

export interface ProgressHubFilterProps {
  value: ProgressHubCategoryId;
  onChange: (value: ProgressHubCategoryId) => void;
}

export function ProgressHubFilter({ value, onChange }: ProgressHubFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Progress categories">
      {PROGRESS_HUB_CATEGORY_FILTERS.map((category) => {
        const isActive = value === category.id;
        const isDisabled = "disabled" in category && category.disabled === true;
        const Icon = PROGRESS_CATEGORY_ICONS[category.id];

        return (
          <FilterChipButton
            key={category.id}
            isActive={isActive}
            disabled={isDisabled}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) onChange(category.id);
            }}
          >
            <span className="flex items-center gap-1.5">
              <Icon
                className={cn(
                  "shrink-0",
                  category.id === "achievements" ? "size-[15px]" : "size-[18px]",
                )}
              />
              {category.label}
            </span>
          </FilterChipButton>
        );
      })}
    </div>
  );
}
