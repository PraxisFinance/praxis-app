import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import type {
  LeaderboardSlice,
  LeaderboardSliceState,
  ProgressLeaderboardHydration,
} from "./types";

export const LEADERBOARD_INITIAL_STATE: LeaderboardSliceState = {
  entries: [],
  userRank: null,
  loading: false,
  error: null,
};

export const createLeaderboardActions: StateCreator<
  ProgressStore,
  [],
  [],
  Pick<
    LeaderboardSlice,
    | "hydrateLeaderboard"
    | "setLeaderboardLoading"
    | "setLeaderboardError"
    | "resetLeaderboard"
  >
> = (set) => ({
  hydrateLeaderboard: (payload: ProgressLeaderboardHydration) =>
    set({
      entries: payload.entries,
      userRank: payload.userRank,
      error: null,
    }),

  setLeaderboardLoading: (loading) => set({ loading }),

  setLeaderboardError: (error) => set({ error }),

  resetLeaderboard: () => set(LEADERBOARD_INITIAL_STATE),
});
