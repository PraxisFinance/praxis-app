import { Check, X } from "lucide-react";
import { ACHIEVEMENT_ITEM_ICONS } from "@/components/icons/progress/achievements/items";
import { cn } from "@/lib/utils";
import type { AchievementItem } from "@/shared/types/achievements";

export interface AchievementItemRowProps {
  item: AchievementItem;
}

export function AchievementItemRow({ item }: AchievementItemRowProps) {
  const isCompleted = item.status === "completed";
  const Icon = ACHIEVEMENT_ITEM_ICONS[item.iconId];

  return (
    <div className="bg-main-white flex items-center gap-3 rounded-sm border border-main-grayPurple/60 px-3 py-2.5">
      <span className="bg-main-lightGray text-main-purple flex size-10 shrink-0 items-center justify-center rounded-sm">
        <Icon className="size-6" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-header-6 text-main-darkPurple">{item.title}</span>
        <p className="text-text-6 text-main-darkPurple/50">{item.description}</p>
      </div>

      <div className="flex shrink-0 flex-col gap-0.5">
        <span className="text-text-6 text-main-darkPurple">Points</span>
        <span className="text-text-6 text-main-purple tabular-nums">{item.xpReward} XP</span>
      </div>

      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-sm",
          isCompleted ? "bg-main-success" : "bg-main-lightGray",
        )}
        aria-hidden
      >
        {isCompleted ? (
          <Check className="size-4 text-white" strokeWidth={2.5} />
        ) : (
          <X className="text-main-darkPurple size-4" strokeWidth={2.5} />
        )}
      </span>
    </div>
  );
}
