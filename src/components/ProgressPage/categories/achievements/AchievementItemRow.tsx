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
    <div className="bg-main-lightGray border border-main-grayPurple flex items-start gap-3 rounded-sm px-3 py-3">
      <span className="bg-main-grayPurple/50 text-main-purple flex size-11 shrink-0 items-center justify-center self-start rounded-sm border border-main-grayPurple">
        <Icon className="size-6" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-0.5 self-start">
        <span className="text-header-6 text-main-darkPurple">{item.title}</span>
        <p className="text-text-6 text-main-darkPurple/50">{item.description}</p>
      </div>

      <div className="flex shrink-0 flex-col items-start justify-start gap-0.5 self-start">
        <span className="text-header-6 text-main-darkPurple">Points</span>
        <span className="text-text-6 text-main-purple tabular-nums">{item.xpReward} XP</span>
      </div>

      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center self-start rounded-sm border border-main-grayPurple",
          isCompleted ? "bg-main-success" : "bg-main-grayPurple/50"
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
