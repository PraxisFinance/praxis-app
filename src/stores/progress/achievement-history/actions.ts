import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import { mapHistoryApiResponse } from "./mappers";
import type {
  AchievementHistoryApiResponse,
  AchievementHistorySlice,
  AchievementHistorySliceState,
} from "./types";
import { DEFAULT_HISTORY_PAGE_SIZE } from "./types";

export const ACHIEVEMENT_HISTORY_INITIAL_STATE: AchievementHistorySliceState = {
  items: [],
  page: 1,
  pageSize: DEFAULT_HISTORY_PAGE_SIZE,
  total: null,
  hasMore: false,
  loading: false,
  error: null,
};

export const createAchievementHistoryActions: StateCreator<
  ProgressStore,
  [],
  [],
  Pick<
    AchievementHistorySlice,
    | "hydrateHistory"
    | "setHistoryPage"
    | "setHistoryLoading"
    | "setHistoryError"
    | "resetAchievementHistory"
  >
> = (set) => ({
  hydrateHistory: (payload: AchievementHistoryApiResponse) =>
    set({
      items: mapHistoryApiResponse(payload),
      page: payload.page ?? 1,
      pageSize: payload.pageSize ?? DEFAULT_HISTORY_PAGE_SIZE,
      total: payload.total ?? null,
      hasMore: payload.hasMore ?? false,
      error: null,
    }),

  setHistoryPage: (page) => set({ page }),

  setHistoryLoading: (loading) => set({ loading }),

  setHistoryError: (error) => set({ error }),

  resetAchievementHistory: () => set(ACHIEVEMENT_HISTORY_INITIAL_STATE),
});
