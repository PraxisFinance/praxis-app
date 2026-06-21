export const PROGRESS_HUB_CATEGORY_FILTERS = [
  { id: "achievements", label: "Achievements", title: "Achievements" },
  { id: "leaderboard", label: "Leaderboard", title: null },
  { id: "history", label: "History", title: null },
  { id: "quests", label: "Quests", title: "Quests", disabled: true },
] as const;

export type ProgressHubCategoryFilter = (typeof PROGRESS_HUB_CATEGORY_FILTERS)[number];
export type ProgressHubCategoryId = ProgressHubCategoryFilter["id"];

export const PROGRESS_HUB_DISABLED_CATEGORY_IDS = new Set<ProgressHubCategoryId>(
  PROGRESS_HUB_CATEGORY_FILTERS.filter((category) => "disabled" in category && category.disabled).map(
    (category) => category.id,
  ),
);

export const FIRST_PROGRESS_HUB_CATEGORY_ID: ProgressHubCategoryId =
  PROGRESS_HUB_CATEGORY_FILTERS[0].id;

export const DEFAULT_PROGRESS_HUB_CATEGORY_ID: ProgressHubCategoryId = "history";

export function isProgressHubCategoryId(value: string): value is ProgressHubCategoryId {
  return PROGRESS_HUB_CATEGORY_FILTERS.some((category) => category.id === value);
}

export function resolveProgressHubCategoryId(value: string | null | undefined): ProgressHubCategoryId {
  if (
    value != null &&
    isProgressHubCategoryId(value) &&
    !PROGRESS_HUB_DISABLED_CATEGORY_IDS.has(value)
  ) {
    return value;
  }

  return DEFAULT_PROGRESS_HUB_CATEGORY_ID;
}
