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
      return pathname === "/predictions" || pathname === "/predictions/all";
    case "cryptocurrency":
      return pathname === "/predictions/cryptocurrency";
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
