export type AchievementItemIconId =
  | "dice"
  | "chart"
  | "deposit"
  | "prediction"
  | "profile"
  | "wallet"
  | "yield"
  | "trophy"
  | "invite"
  | "crypto"
  | "esports"
  | "finance"
  | "calendar"
  | "stake"
  | "target"
  | "gift";

export type AchievementStatus = "locked" | "in_progress" | "completed";

export type AchievementCategoryId =
  | "core-flow"
  | "referal"
  | "market-coverage"
  | "activity"
  | "yield-predictions"
  | "perfomance"
  | "bonus";

export interface AchievementItem {
  id: string;
  iconId: AchievementItemIconId;
  title: string;
  description: string;
  xpReward: number;
  status: AchievementStatus;
  /** Present when `status` is `in_progress`. */
  progress?: {
    current: number;
    total: number;
  };
}

export interface AchievementCategory {
  id: AchievementCategoryId;
  label: string;
  achievements: AchievementItem[];
}
