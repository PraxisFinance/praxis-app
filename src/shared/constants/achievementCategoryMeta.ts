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

/** Maps backend category slugs to UI category ids. */
export const ACHIEVEMENT_API_CATEGORY_ALIASES: Record<string, AchievementCategoryId> = {
  onboarding: "core-flow",
  "core-flow": "core-flow",
  referral: "referal",
  referal: "referal",
  market: "market-coverage",
  "market-coverage": "market-coverage",
  activity: "activity",
  yield: "yield-predictions",
  "yield-predictions": "yield-predictions",
  performance: "perfomance",
  perfomance: "perfomance",
  bonus: "bonus",
};

export function resolveAchievementCategoryId(category: string): AchievementCategoryId | null {
  if (isAchievementCategoryId(category)) return category;
  return ACHIEVEMENT_API_CATEGORY_ALIASES[category] ?? null;
}
