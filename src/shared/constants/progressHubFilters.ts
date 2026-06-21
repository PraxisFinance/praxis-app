export const PROGRESS_HUB_CATEGORY_FILTERS = [
  { id: "achievements", label: "Achievements", title: "Achievements" },
  { id: "leaderboard", label: "Leaderboard", title: null },
  { id: "history", label: "History", title: null },
  { id: "quests", label: "Quests", title: "Quests" },
] as const;

export type ProgressHubCategoryId = (typeof PROGRESS_HUB_CATEGORY_FILTERS)[number]["id"];

export const DEFAULT_PROGRESS_HUB_CATEGORY_ID: ProgressHubCategoryId = "history";

export function isProgressHubCategoryId(value: string): value is ProgressHubCategoryId {
  return PROGRESS_HUB_CATEGORY_FILTERS.some((category) => category.id === value);
}
