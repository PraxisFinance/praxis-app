import { ACHIEVEMENT_ITEM_ICONS } from "@/components/icons/progress/achievements/items";
import { formatHistoryTimestamp } from "@/components/HistoryPage/historyEventFormat";
import type { AchievementHistoryItem } from "@/stores/progress/achievement-history/types";

export interface ProgressAchievementHistoryRowProps {
  item: AchievementHistoryItem;
}

export function ProgressAchievementHistoryRow({ item }: ProgressAchievementHistoryRowProps) {
  const Icon = ACHIEVEMENT_ITEM_ICONS[item.iconId];
  const completedAtMs = Date.parse(item.completedAt);
  const timestamp = Number.isNaN(completedAtMs) ? null : formatHistoryTimestamp(completedAtMs);

  return (
    <article className="bg-main-lightGray flex flex-col gap-1 rounded-lg px-3 py-2.5">
      {timestamp != null ? (
        <time
          className="text-text-6 text-main-darkPurple/50 tabular-nums"
          dateTime={item.completedAt}
        >
          {timestamp}
        </time>
      ) : null}

      <div className="flex min-w-0 items-center gap-2">
        <span className="text-main-purple inline-flex shrink-0" aria-hidden>
          <Icon className="size-5" />
        </span>

        <span className="text-header-6 text-main-darkPurple min-w-0 flex-1 truncate">
          {item.title}
        </span>

        <span className="bg-main-grayPurple text-header-6 text-main-darkPurple shrink-0 rounded-sm px-2.5 py-1 tabular-nums">
          +{item.xpReward} XP
        </span>
      </div>
    </article>
  );
}
