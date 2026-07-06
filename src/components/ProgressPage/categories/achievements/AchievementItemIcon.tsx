import Image from "next/image";
import { ACHIEVEMENT_ITEM_ICONS } from "@/components/icons/progress/achievements/items";
import { cn } from "@/lib/utils";
import type { AchievementItemIconId } from "@/shared/types/achievements";

export interface AchievementItemIconProps {
  iconId: AchievementItemIconId;
  iconUrl?: string | null;
  className?: string;
  imageClassName?: string;
}

export function AchievementItemIcon({
  iconId,
  iconUrl,
  className,
  imageClassName,
}: AchievementItemIconProps) {
  const Icon = ACHIEVEMENT_ITEM_ICONS[iconId];
  const trimmedIconUrl = iconUrl?.trim();

  if (trimmedIconUrl) {
    return (
      <Image
        src={trimmedIconUrl}
        alt=""
        width={24}
        height={24}
        className={cn("size-6 object-contain", imageClassName, className)}
        aria-hidden
      />
    );
  }

  return <Icon className={cn("size-6", className)} aria-hidden />;
}
