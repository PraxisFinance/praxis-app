"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { PageSkeleton } from "@/components/ui/skeleton";
import {
  HISTORY_PAGE_CLOCK_ANCHOR_MS,
  HISTORY_TIME_FILTER_OPTIONS,
  historyTimeFilterCutoffMs,
} from "@/shared/constants/history";
import type { HistoryTimeFilter } from "@/shared/types/history";
import { useHistoryStore } from "@/stores/historyStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { HistoryEventCard } from "./HistoryEventCard";
import { historyItemToDisplayEvent } from "./historyItemAdapter";

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
  const { address } = useAccount();
  const history = useHistoryStore((s) => s.history);
  const historyLoaded = useStatisticsStore((s) => s.historyLoaded);
  const isLoading = Boolean(address) && !historyLoaded;

  const visibleEvents = useMemo(() => {
    const from = historyTimeFilterCutoffMs(timeFilter, nowMs);
    return history
      .map(historyItemToDisplayEvent)
      .filter((e) => e.timestamp >= from)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [history, timeFilter, nowMs]);

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
        {isLoading ? (
          <PageSkeleton variant="list" rows={4} />
        ) : visibleEvents.length > 0 ? (
          visibleEvents.map((event) => (
            <HistoryEventCard key={event.id} event={event} label={event.label} />
          ))
        ) : (
          <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
            No actions in this period.
          </p>
        )}
      </div>
    </div>
  );
}
