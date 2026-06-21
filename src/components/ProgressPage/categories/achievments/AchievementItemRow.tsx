import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import {
  getAchievementItemProgressPercent,
} from "@/shared/constants/achievements";
import type { AchievementItem } from "@/shared/types/achievements";

export interface AchievementItemProps {
  item: AchievementItem;
}

export function AchievementItemRow({ item }: AchievementItemProps) {
  const progressPercent = getAchievementItemProgressPercent(item);
  const isLocked = item.status === "locked";
  const isCompleted = item.status === "completed";

  return (
    <div
      className={cn(
        "bg-main-white/70 flex flex-col gap-2 rounded-sm px-3 py-2.5",
        isLocked && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-header-6 text-main-darkPurple">{item.title}</span>
          <p className="text-text-6 text-main-darkPurple/70">{item.description}</p>
        </div>
        <span
          className={cn(
            "text-text-7 shrink-0 tabular-nums",
            isCompleted ? "text-main-success" : "text-main-darkPurple",
          )}
        >
          +{item.xpReward} XP
        </span>
      </div>

      {progressPercent != null ? (
        <div className="flex flex-col gap-1">
          <ProgressBar value={progressPercent} variant="ended" className="bg-main-grayPurple/80 h-1.5" />
          {item.progress != null ? (
            <span className="text-text-8 text-main-darkPurple/70 tabular-nums">
              {item.progress.current}/{item.progress.total}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
