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
} from "lucide-react";
import type { AchievementItemIconId } from "@/shared/types/achievements";
import type { ProgressCategoryIconProps } from "@/components/icons/progress/progressIconProps";
import { ChartIcon } from "./ChartIcon";
import { DiceIcon } from "./DiceIcon";

function LucideAchievementIcon({
  icon: Icon,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return <Icon className={className} strokeWidth={2} aria-hidden />;
}

export const ACHIEVEMENT_ITEM_ICONS: Record<
  AchievementItemIconId,
  ComponentType<ProgressCategoryIconProps>
> = {
  dice: DiceIcon,
  chart: ChartIcon,
  deposit: ({ className }) => <LucideAchievementIcon icon={Wallet} className={className} />,
  prediction: ({ className }) => <LucideAchievementIcon icon={LineChart} className={className} />,
  profile: ({ className }) => <LucideAchievementIcon icon={User} className={className} />,
  wallet: ({ className }) => <LucideAchievementIcon icon={Wallet} className={className} />,
  yield: ({ className }) => <LucideAchievementIcon icon={Coins} className={className} />,
  trophy: ({ className }) => <LucideAchievementIcon icon={Trophy} className={className} />,
  invite: ({ className }) => <LucideAchievementIcon icon={Users} className={className} />,
  crypto: ({ className }) => <LucideAchievementIcon icon={Coins} className={className} />,
  esports: ({ className }) => <LucideAchievementIcon icon={Target} className={className} />,
  finance: ({ className }) => <LucideAchievementIcon icon={LineChart} className={className} />,
  calendar: ({ className }) => <LucideAchievementIcon icon={Calendar} className={className} />,
  stake: ({ className }) => <LucideAchievementIcon icon={Coins} className={className} />,
  target: ({ className }) => <LucideAchievementIcon icon={Target} className={className} />,
  gift: ({ className }) => <LucideAchievementIcon icon={Gift} className={className} />,
};
