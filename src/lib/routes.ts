import { isPredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";

/** App route paths — keep in sync with `src/app/(app)` page files. */

export const MAIN_ROUTE = "/main";
export const EARN_ROUTE = "/earn";
export const PROGRESS_ROUTE = "/progress";
/** @deprecated Use `PROGRESS_ROUTE` with `?category=history`. Kept for redirects. */
export const HISTORY_ROUTE = "/history";
export const HOW_IT_WORKS_ROUTE = "/how-it-works";
export const INVITE_FRIENDS_ROUTE = "/invite-friends";
/** @deprecated Use `buildProgressHubRoute("leaderboard")`. Kept for redirects. */
export const LEADERBOARD_ROUTE = "/leaderboard";

export const PREDICTIONS_ROUTE = "/predictions";

/** Query key for hub category preset on `/predictions`. */
export const PREDICTIONS_HUB_CATEGORY_QUERY = "category";

export function buildPredictionsHubRoute(categoryId: string): string {
  return `${PREDICTIONS_ROUTE}?${PREDICTIONS_HUB_CATEGORY_QUERY}=${encodeURIComponent(categoryId)}`;
}

/** Query key for hub category preset on `/progress`. */
export const PROGRESS_HUB_CATEGORY_QUERY = "category";

export function buildProgressHubRoute(categoryId: string): string {
  return `${PROGRESS_ROUTE}?${PROGRESS_HUB_CATEGORY_QUERY}=${encodeURIComponent(categoryId)}`;
}

/** Any screen under the Progress section (bottom nav). */
export function isProgressSectionPath(pathname: string): boolean {
  return pathname === PROGRESS_ROUTE || pathname.startsWith(`${PROGRESS_ROUTE}/`);
}

/** Hub prediction detail: `/predictions/[id]`. */
export function buildPredictionsHubDetailRoute(id: string): string {
  return `${PREDICTIONS_ROUTE}/${encodeURIComponent(id)}`;
}

/** True for `/predictions/[id]` detail pages (not hub category slugs). */
export function isPredictionsHubDetailPath(pathname: string): boolean {
  const match = pathname.match(/^\/predictions\/([^/]+)$/);
  if (!match) return false;
  const segment = decodeURIComponent(match[1]);
  return !isPredictionsHubCategoryId(segment);
}

export const PROFILE_ROUTE = "/profile";
export const PROFILE_BALANCES_ROUTE = "/profile/balances";
export const PROFILE_REWARDS_ROUTE = "/profile/rewards";
export const PROFILE_DEPOSITS_ROUTE = "/profile/deposits";
export const PROFILE_PREDICTIONS_ROUTE = "/profile/predictions";
export const PROFILE_SETTINGS_ROUTE = "/profile/settings";

/** Any screen under the Predictions section (bottom nav). */
export function isPredictionsSectionPath(pathname: string): boolean {
  return pathname === PREDICTIONS_ROUTE || pathname.startsWith(`${PREDICTIONS_ROUTE}/`);
}

/** Any screen under the Profile section (bottom nav + tab bar). */
export function isProfileSectionPath(pathname: string): boolean {
  return pathname === PROFILE_ROUTE || pathname.startsWith(`${PROFILE_ROUTE}/`);
}

export type ProfileTabId = "balances" | "rewards" | "deposits" | "predictions" | "settings";

/** Active state for a Profile sub-tab link. */
export function isProfileSubTabActive(tabId: ProfileTabId, pathname: string): boolean {
  switch (tabId) {
    case "balances":
      return pathname === PROFILE_ROUTE || pathname === PROFILE_BALANCES_ROUTE;
    case "rewards":
      return pathname === PROFILE_REWARDS_ROUTE;
    case "deposits":
      return pathname === PROFILE_DEPOSITS_ROUTE;
    case "predictions":
      return pathname === PROFILE_PREDICTIONS_ROUTE;
    case "settings":
      return pathname === PROFILE_SETTINGS_ROUTE;
    default:
      return false;
  }
}
