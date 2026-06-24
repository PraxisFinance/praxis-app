import type { AchievementPublic, UserAchievementView } from "@/shared/types/api";
import type { AchievementCategory, AchievementItem } from "@/shared/types/achievements";
import type { UserAchievementsHydration, UserProgressStats } from "./types";

const DEFAULT_LEVEL_DESCRIPTION =
  "Upgrade your account and receive bonuses when you use the app.";

export function mapUserProgressStats(payload: UserAchievementsHydration): UserProgressStats {
  return {
    totalXp: payload.totalXp,
    level: payload.level ?? 1,
    currentXp: payload.currentXp ?? payload.totalXp,
    xpToNextLevel: payload.xpToNextLevel ?? 100,
    description: payload.description ?? DEFAULT_LEVEL_DESCRIPTION,
  };
}

export function mapApiStatusToUiStatus(
  status: UserAchievementView["status"],
): AchievementItem["status"] {
  return status === "completed" ? "completed" : "in_progress";
}

/**
 * Merges catalogue definitions with user progress into UI categories.
 * Icon mapping and full category grouping will be expanded when mocks are removed.
 */
export function mapDefinitionsToCategories(
  definitions: AchievementPublic[],
  userAchievements: UserAchievementView[] | null,
): AchievementCategory[] {
  void definitions;
  void userAchievements;
  return [];
}
