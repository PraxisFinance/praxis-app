"use client";

import { useMemo, useState } from "react";
import { AchievementItemRow } from "@/components/ProgressPage/categories/achievements/AchievementItemRow";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ACHIEVEMENT_HISTORY_MOCK } from "@/shared/constants/achievements";
import { HISTORY_TIME_FILTER_OPTIONS } from "@/shared/constants/history";
import type { HistoryTimeFilter } from "@/shared/types/history";

export function ProgressAchievementHistoryPanel() {
  const [timeFilter, setTimeFilter] = useState<HistoryTimeFilter>("3D");

  const visibleAchievements = useMemo(() => {
    void timeFilter;
    return ACHIEVEMENT_HISTORY_MOCK;
  }, [timeFilter]);

  return (
    <div className="flex min-h-full flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-2">
        {/* <SectionHeader className="text-main-darkPurple">Achievements history</SectionHeader> */}
        <FilterDropdown
          options={HISTORY_TIME_FILTER_OPTIONS}
          value={timeFilter}
          onChange={setTimeFilter}
          minWidth="108px"
          className="shrink-0"
        />
      </div>

      <div className="flex flex-col gap-2">
        {visibleAchievements.length > 0 ? (
          visibleAchievements.map((item) => <AchievementItemRow key={item.id} item={item} />)
        ) : (
          <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
            No achievements in this period.
          </p>
        )}
      </div>
    </div>
  );
}
