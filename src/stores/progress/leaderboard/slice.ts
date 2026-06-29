import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import { createLeaderboardActions, LEADERBOARD_INITIAL_STATE } from "./actions";
import type { LeaderboardSlice } from "./types";

export const createLeaderboardSlice: StateCreator<ProgressStore, [], [], LeaderboardSlice> = (
  set,
  get,
  api,
) => ({
  ...LEADERBOARD_INITIAL_STATE,
  ...createLeaderboardActions(set, get, api),
});
