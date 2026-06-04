/** Main menu (/) middle cards — canonical paths. */
export const EARN_ROUTE = "/earn";

export const PREDICTIONS_ROUTE = "/predictions";

/** Query key for hub category preset on `/predictions`. */
export const PREDICTIONS_HUB_CATEGORY_QUERY = "category";

export function buildPredictionsHubRoute(categoryId: string): string {
  return `${PREDICTIONS_ROUTE}?${PREDICTIONS_HUB_CATEGORY_QUERY}=${encodeURIComponent(categoryId)}`;
}

/** Legacy and section routes under `/predictions` — not hub item detail ids. */
const PREDICTIONS_RESERVED_PATH_SEGMENTS = new Set([
  "all",
  "cryptocurrency",
  "esports",
  "random-rewards",
  "detail",
]);

/** Hub prediction detail: `/predictions/[id]` (category comes from item data). */
export function buildPredictionsHubDetailRoute(id: string): string {
  return `${PREDICTIONS_ROUTE}/${encodeURIComponent(id)}`;
}

export function isPredictionsHubDetailPath(pathname: string): boolean {
  const match = pathname.match(/^\/predictions\/([^/]+)$/);
  if (!match) return false;
  const segment = decodeURIComponent(match[1]);
  return !PREDICTIONS_RESERVED_PATH_SEGMENTS.has(segment);
}

export const PREDICTIONS_ALL_ROUTE = "/predictions/all";

export const PREDICTIONS_RANDOM_REWARDS_ROUTE = "/predictions/random-rewards";

export const PREDICTIONS_CRYPTOCURRENCY_ROUTE = "/predictions/cryptocurrency";

export const PREDICTIONS_ESPORTS_ROUTE = "/predictions/esports";

/** Any screen under the Predictions section (bottom nav + tab bar). */
export function isPredictionsSectionPath(pathname: string): boolean {
  return pathname === "/predictions" || pathname.startsWith("/predictions/");
}

/** Any screen under the Profile section (bottom nav + tab bar). */
export function isProfileSectionPath(pathname: string): boolean {
  return pathname === "/profile" || pathname.startsWith("/profile/");
}

export type ProfileTabId = "balances" | "rewards" | "deposits" | "predictions" | "settings";

/** Active state for a Profile sub-tab link. */
export function isProfileSubTabActive(tabId: ProfileTabId, pathname: string): boolean {
  switch (tabId) {
    case "balances":
      return pathname === "/profile" || pathname === "/profile/balances";
    case "rewards":
      return pathname === "/profile/rewards";
    case "deposits":
      return pathname === "/profile/deposits";
    case "predictions":
      return pathname === "/profile/predictions";
    case "settings":
      return pathname === "/profile/settings";
    default:
      return false;
  }
}

export type PredictionsTabId = "all" | "cryptocurrency" | "esports" | "random-rewards";

/** Active state for a Predictions sub-tab link (matches PredictionsTabBar rules). */
export function isPredictionsSubTabActive(tabId: PredictionsTabId, pathname: string): boolean {
  switch (tabId) {
    case "all":
      return pathname === PREDICTIONS_ALL_ROUTE;
    case "cryptocurrency":
      return (
        pathname === "/predictions/cryptocurrency" ||
        pathname.startsWith("/predictions/cryptocurrency/")
      );
    case "esports":
      return pathname === "/predictions/esports";
    case "random-rewards":
      return (
        pathname === "/predictions/random-rewards" ||
        pathname.startsWith("/predictions/random-rewards/")
      );
    default:
      return false;
  }
}

/** Random pool details page: `/predictions/random-rewards/[id]` */
export function isRandomRewardsPoolDetailPath(pathname: string): boolean {
  return /^\/predictions\/random-rewards\/[^/]+$/.test(pathname);
}

/** Two-Pool detail page: `/predictions/cryptocurrency/twopools/[id]` */
export function isTwoPoolDetailPath(pathname: string): boolean {
  return /^\/predictions\/cryptocurrency\/twopools\/[^/]+$/.test(pathname);
}
