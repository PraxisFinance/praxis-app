export type MenuItemType = "large" | "middle";

export interface MenuItem {
  type: MenuItemType;
  key: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  redirectUrl?: string;
  redirectLabel?: string;
}
