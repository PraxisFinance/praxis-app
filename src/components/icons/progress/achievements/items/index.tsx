import type { ComponentType } from "react";
import {
  Calendar,
  Coins,
  Gift,
  LineChart,
  Target,
  Trophy,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { AchievementItemIconId } from "@/shared/types/achievements";
import type { ProgressCategoryIconProps } from "@/components/icons/progress/progressIconProps";
import { ChartIcon } from "./ChartIcon";
import { DiceIcon } from "./DiceIcon";

function LucideAchievementIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return <Icon className={className} strokeWidth={2} aria-hidden />;
}

function lucideAchievementIcon(icon: LucideIcon): ComponentType<ProgressCategoryIconProps> {
  return function AchievementLucideIcon({ className }) {
    return <LucideAchievementIcon icon={icon} className={className} />;
  };
}

export const ACHIEVEMENT_ITEM_ICONS: Record<
  AchievementItemIconId,
  ComponentType<ProgressCategoryIconProps>
> = {
  dice: DiceIcon,
  chart: ChartIcon,
  deposit: lucideAchievementIcon(Wallet),
  prediction: lucideAchievementIcon(LineChart),
  profile: lucideAchievementIcon(User),
  wallet: lucideAchievementIcon(Wallet),
  yield: lucideAchievementIcon(Coins),
  trophy: lucideAchievementIcon(Trophy),
  invite: lucideAchievementIcon(Users),
  crypto: lucideAchievementIcon(Coins),
  esports: lucideAchievementIcon(Target),
  finance: lucideAchievementIcon(LineChart),
  calendar: lucideAchievementIcon(Calendar),
  stake: lucideAchievementIcon(Coins),
  target: lucideAchievementIcon(Target),
  gift: lucideAchievementIcon(Gift),
};
