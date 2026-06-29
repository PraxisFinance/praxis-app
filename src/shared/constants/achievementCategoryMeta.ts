import type { AchievementCategoryId } from "@/shared/types/achievements";

export const ACHIEVEMENT_CATEGORY_ORDER: AchievementCategoryId[] = [
  "core-flow",
  "referal",
  "market-coverage",
  "activity",
  "yield-predictions",
  "perfomance",
  "bonus",
];

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategoryId, string> = {
  "core-flow": "Core Flow",
  referal: "Referal",
  "market-coverage": "Market Coverage",
  activity: "Activity",
  "yield-predictions": "Yield Predictions",
  perfomance: "Perfomance",
  bonus: "Bonus",
};

const ACHIEVEMENT_CATEGORY_ID_SET = new Set<string>(ACHIEVEMENT_CATEGORY_ORDER);

export function isAchievementCategoryId(value: string): value is AchievementCategoryId {
  return ACHIEVEMENT_CATEGORY_ID_SET.has(value);
}
