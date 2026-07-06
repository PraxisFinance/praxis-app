import type { CheckResult, UserAchievementView } from "@/shared/types/api";

/** Progress stats block — fields come from GET /achievements/me when available. */
export interface UserProgressStats {
  totalXp: number;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  description: string | null;
}

export interface UserAchievementsHydration {
  achievements: UserAchievementView[];
  totalXp: number;
  level?: number;
  currentXp?: number;
  xpToNextLevel?: number;
  description?: string | null;
}

export interface AchievementsSliceState {
  userAchievements: UserAchievementView[] | null;
  stats: UserProgressStats | null;
  loading: boolean;
  error: string | null;
}

export interface AchievementsSliceActions {
  hydrateUser: (payload: UserAchievementsHydration) => void;
  patchFromCheckResult: (result: CheckResult) => void;
  setAchievementsLoading: (loading: boolean) => void;
  setAchievementsError: (error: string | null) => void;
  resetAchievements: () => void;
}

export type AchievementsSlice = AchievementsSliceState & AchievementsSliceActions;
