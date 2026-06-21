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
