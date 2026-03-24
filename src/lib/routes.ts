/** Any screen under the Predictions section (bottom nav + tab bar). */
export function isPredictionsSectionPath(pathname: string): boolean {
  return pathname === "/predictions" || pathname.startsWith("/predictions/");
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
