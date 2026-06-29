import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import {
  ACHIEVEMENT_HISTORY_INITIAL_STATE,
  createAchievementHistoryActions,
} from "./actions";
import type { AchievementHistorySlice } from "./types";

export const createAchievementHistorySlice: StateCreator<
  ProgressStore,
  [],
  [],
  AchievementHistorySlice
> = (set, get, api) => ({
  ...ACHIEVEMENT_HISTORY_INITIAL_STATE,
  ...createAchievementHistoryActions(set, get, api),
});
