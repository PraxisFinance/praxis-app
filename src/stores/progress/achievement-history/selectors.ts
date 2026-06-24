import type { HistoryTimeFilter } from "@/shared/types/history";
import { historyTimeFilterCutoffMs } from "@/shared/constants/history";
import type { ProgressStore } from "@/stores/progress/types";

export function selectAchievementHistoryItems(
  state: Pick<ProgressStore, "items">,
  timeFilter: HistoryTimeFilter,
  nowMs = Date.now(),
): ProgressStore["items"] {
  const cutoffMs = historyTimeFilterCutoffMs(timeFilter, nowMs);

  return state.items.filter((item) => {
    const completedAtMs = Date.parse(item.completedAt);
    if (Number.isNaN(completedAtMs)) return true;
    return completedAtMs >= cutoffMs;
  });
}
