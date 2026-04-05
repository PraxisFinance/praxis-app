"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import {
  HISTORY_EVENTS_MOCK,
  HISTORY_PAGE_CLOCK_ANCHOR_MS,
  HISTORY_TIME_FILTER_OPTIONS,
  historyTimeFilterCutoffMs,
} from "@/shared/constants/history";
import type { HistoryTimeFilter } from "@/shared/types/history";
import { HistoryEventCard } from "./HistoryEventCard";

const NOW_BUCKET_MS = 60_000;

function useHistoryPageNowMs(): number {
  const bucket = useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setInterval(onStoreChange, NOW_BUCKET_MS);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / NOW_BUCKET_MS),
    () => Math.floor(HISTORY_PAGE_CLOCK_ANCHOR_MS / NOW_BUCKET_MS)
  );
  return bucket * NOW_BUCKET_MS;
}

export function HistoryPage() {
  const [timeFilter, setTimeFilter] = useState<HistoryTimeFilter>("3D");
  const nowMs = useHistoryPageNowMs();

  const visibleEvents = useMemo(() => {
    const from = historyTimeFilterCutoffMs(timeFilter, nowMs);
    return HISTORY_EVENTS_MOCK.filter((e) => e.timestamp >= from).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [timeFilter, nowMs]);

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

      <div className="flex flex-col gap-3">
        {visibleEvents.length > 0 ? (
          visibleEvents.map((event) => <HistoryEventCard key={event.id} event={event} />)
        ) : (
          <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
            No actions in this period.
          </p>
        )}
      </div>
    </div>
  );
}
