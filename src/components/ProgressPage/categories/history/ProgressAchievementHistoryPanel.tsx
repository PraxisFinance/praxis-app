"use client";

import { useMemo, useState } from "react";
import { ProgressAchievementHistoryRow } from "@/components/ProgressPage/categories/history/ProgressAchievementHistoryRow";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useStableNowMs } from "@/hooks/useStableNowMs";
import { selectAchievementHistoryItems } from "@/stores/progress/achievement-history/selectors";
import { useProgressStore } from "@/stores/progress/store";
import { HISTORY_PAGE_CLOCK_ANCHOR_MS, HISTORY_TIME_FILTER_OPTIONS } from "@/shared/constants/history";
import type { HistoryTimeFilter } from "@/shared/types/history";

export function ProgressAchievementHistoryPanel() {
  const [timeFilter, setTimeFilter] = useState<HistoryTimeFilter>("3D");
  const items = useProgressStore((state) => state.items);
  const loading = useProgressStore((state) => state.loading);
  const error = useProgressStore((state) => state.error);
  const nowMs = useStableNowMs(HISTORY_PAGE_CLOCK_ANCHOR_MS);

  const visibleAchievements = useMemo(
    () => selectAchievementHistoryItems({ items }, timeFilter, nowMs),
    [items, timeFilter, nowMs],
  );

  return (
    <div className="flex min-h-full flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-2">
        <SectionHeader className="text-main-darkPurple">Actions history</SectionHeader>
        <FilterDropdown
          options={HISTORY_TIME_FILTER_OPTIONS}
          value={timeFilter}
          onChange={setTimeFilter}
          minWidth="108px"
          className="shrink-0"
        />
      </div>

      {loading ? (
        <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
          Loading actions history…
        </p>
      ) : null}

      {error != null ? (
        <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">{error}</p>
      ) : null}

      {!loading && error == null ? (
        <div className="flex flex-col gap-2">
          {visibleAchievements.length > 0 ? (
            visibleAchievements.map((item) => (
              <ProgressAchievementHistoryRow key={item.id} item={item} />
            ))
          ) : (
            <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
              No actions in this period.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
