import type { UserAchievementView } from "@/shared/types/api";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  isAchievementCategoryId,
} from "@/shared/constants/achievementCategoryMeta";
import type { AchievementCompletedDrawerData } from "@/components/ProgressPage/drawers/achievementCompletedTypes";

export function mapUserAchievementToCompletedDrawerData(
  achievement: UserAchievementView,
): AchievementCompletedDrawerData {
  const categoryLabel = isAchievementCategoryId(achievement.category)
    ? ACHIEVEMENT_CATEGORY_LABELS[achievement.category]
    : achievement.category;

  return {
    title: achievement.title,
    categoryLabel,
    xpEarned: achievement.xpAwarded,
  };
}
