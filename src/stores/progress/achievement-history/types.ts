import type { AchievementItem } from "@/shared/types/achievements";

/** Raw API response — pagination fields are optional until the backend contract is final. */
export interface AchievementHistoryApiResponse {
  items: AchievementHistoryApiItem[];
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

export interface AchievementHistoryApiItem {
  id: string;
  achievementId: string;
  title: string;
  description?: string;
  xpAwarded: number;
  completedAt: string;
}

export interface AchievementHistoryItem extends AchievementItem {
  completedAt: string;
}

export interface AchievementHistorySliceState {
  items: AchievementHistoryItem[];
  page: number;
  pageSize: number;
  total: number | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

export interface AchievementHistorySliceActions {
  hydrateHistory: (payload: AchievementHistoryApiResponse) => void;
  setHistoryPage: (page: number) => void;
  setHistoryLoading: (loading: boolean) => void;
  setHistoryError: (error: string | null) => void;
  resetAchievementHistory: () => void;
}

export type AchievementHistorySlice = AchievementHistorySliceState &
  AchievementHistorySliceActions;

export const DEFAULT_HISTORY_PAGE_SIZE = 20;
