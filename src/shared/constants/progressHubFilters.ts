export const PROGRESS_HUB_CATEGORY_FILTERS = [
  { id: "achievements", label: "Achievements", title: "Achievements" },
  { id: "leaderboard", label: "Leaderboard", title: null },
  { id: "achievement-history", label: "History", title: "Achievements history" },
  { id: "quests", label: "Quests", title: "Quests", disabled: true },
] as const;

export type ProgressHubCategoryFilter = (typeof PROGRESS_HUB_CATEGORY_FILTERS)[number];
export type ProgressHubCategoryId = ProgressHubCategoryFilter["id"];

/** @deprecated Use `achievement-history`. Kept for old progress hub links. */
export const LEGACY_PROGRESS_HISTORY_CATEGORY_ID = "history" as const;

export const PROGRESS_HUB_DISABLED_CATEGORY_IDS = new Set<ProgressHubCategoryId>(
  PROGRESS_HUB_CATEGORY_FILTERS.filter((category) => "disabled" in category && category.disabled).map(
    (category) => category.id,
  ),
);

export const FIRST_PROGRESS_HUB_CATEGORY_ID: ProgressHubCategoryId =
  PROGRESS_HUB_CATEGORY_FILTERS[0].id;

export const DEFAULT_PROGRESS_HUB_CATEGORY_ID: ProgressHubCategoryId = "achievements";

export function isProgressHubCategoryId(value: string): value is ProgressHubCategoryId {
  return PROGRESS_HUB_CATEGORY_FILTERS.some((category) => category.id === value);
}

export function normalizeProgressHubCategoryId(value: string): ProgressHubCategoryId | null {
  if (value === LEGACY_PROGRESS_HISTORY_CATEGORY_ID) {
    return "achievement-history";
  }

  return isProgressHubCategoryId(value) ? value : null;
}

export function resolveProgressHubCategoryId(value: string | null | undefined): ProgressHubCategoryId {
  const normalized = value != null ? normalizeProgressHubCategoryId(value) : null;

  if (
    normalized != null &&
    !PROGRESS_HUB_DISABLED_CATEGORY_IDS.has(normalized)
  ) {
    return normalized;
  }

  return DEFAULT_PROGRESS_HUB_CATEGORY_ID;
}
