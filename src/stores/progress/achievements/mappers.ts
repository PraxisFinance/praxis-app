import { ACHIEVEMENT_CATEGORIES_MOCK } from "@/shared/constants/achievements";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  ACHIEVEMENT_CATEGORY_ORDER,
  isAchievementCategoryId,
} from "@/shared/constants/achievementCategoryMeta";
import type { AchievementPublic, UserAchievementView } from "@/shared/types/api";
import type {
  AchievementCategory,
  AchievementCategoryId,
  AchievementItem,
  AchievementItemIconId,
} from "@/shared/types/achievements";
import type { UserAchievementsHydration, UserProgressStats } from "./types";

const DEFAULT_LEVEL_DESCRIPTION =
  "Upgrade your account and receive bonuses when you use the app.";

const ACHIEVEMENT_ICON_BY_ID: Record<string, AchievementItemIconId> = Object.fromEntries(
  ACHIEVEMENT_CATEGORIES_MOCK.flatMap((category) =>
    category.achievements.map((item) => [item.id, item.iconId]),
  ),
) as Record<string, AchievementItemIconId>;

const CATEGORY_DEFAULT_ICON: Record<AchievementCategoryId, AchievementItemIconId> = {
  "core-flow": "deposit",
  referal: "invite",
  "market-coverage": "chart",
  activity: "calendar",
  "yield-predictions": "stake",
  perfomance: "target",
  bonus: "gift",
};

export function mapUserProgressStats(payload: UserAchievementsHydration): UserProgressStats {
  return {
    totalXp: payload.totalXp,
    level: payload.level ?? 1,
    currentXp: payload.currentXp ?? payload.totalXp,
    xpToNextLevel: payload.xpToNextLevel ?? 100,
    description: payload.description ?? DEFAULT_LEVEL_DESCRIPTION,
  };
}

function resolveAchievementIconId(
  achievementId: string,
  categoryId: AchievementCategoryId,
): AchievementItemIconId {
  return ACHIEVEMENT_ICON_BY_ID[achievementId] ?? CATEGORY_DEFAULT_ICON[categoryId];
}

function normalizeCategoryId(category: string): AchievementCategoryId | null {
  if (isAchievementCategoryId(category)) return category;
  return null;
}

function mapDefinitionToItem(
  definition: AchievementPublic,
  categoryId: AchievementCategoryId,
  userView: UserAchievementView | undefined,
): AchievementItem {
  const iconId = resolveAchievementIconId(definition.id, categoryId);
  const baseXp = definition.xp ?? 0;

  if (userView == null) {
    return {
      id: definition.id,
      iconId,
      title: definition.title,
      description: definition.description,
      xpReward: baseXp,
      status: "locked",
    };
  }

  if (userView.status === "completed") {
    return {
      id: definition.id,
      iconId,
      title: definition.title,
      description: definition.description,
      xpReward: userView.xpAwarded > 0 ? userView.xpAwarded : baseXp,
      status: "completed",
    };
  }

  const item: AchievementItem = {
    id: definition.id,
    iconId,
    title: definition.title,
    description: definition.description,
    xpReward: baseXp,
    status: "in_progress",
  };

  if (definition.targetValue != null && definition.targetValue > 0) {
    item.progress = {
      current: userView.currentValue,
      total: definition.targetValue,
    };
  }

  return item;
}

export function mapDefinitionsToCategories(
  definitions: AchievementPublic[],
  userAchievements: UserAchievementView[] | null,
): AchievementCategory[] {
  const userById = new Map(
    (userAchievements ?? []).map((achievement) => [achievement.id, achievement]),
  );

  const grouped = new Map<AchievementCategoryId, AchievementItem[]>();

  for (const definition of definitions) {
    const categoryId = normalizeCategoryId(definition.category);
    if (categoryId == null) continue;

    const items = grouped.get(categoryId) ?? [];
    items.push(mapDefinitionToItem(definition, categoryId, userById.get(definition.id)));
    grouped.set(categoryId, items);
  }

  return ACHIEVEMENT_CATEGORY_ORDER.flatMap((categoryId) => {
    const achievements = grouped.get(categoryId);
    if (achievements == null || achievements.length === 0) return [];

    return [
      {
        id: categoryId,
        label: ACHIEVEMENT_CATEGORY_LABELS[categoryId],
        achievements,
      },
    ];
  });
}
