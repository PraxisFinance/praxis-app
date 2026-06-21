import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import type { ProgressHubCategoryId } from "@/shared/constants/progressHubFilters";

export type MenuItemType = "large" | "middle";

export interface MenuItem {
  type: MenuItemType;
  key: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  redirectUrl?: string;
  redirectLabel?: string;
  /** Opens `/predictions` with the hub category filter preset. */
  hubCategoryId?: PredictionsHubCategoryId;
  /** Opens `/progress` with the hub category filter preset. */
  progressHubCategoryId?: ProgressHubCategoryId;
}
