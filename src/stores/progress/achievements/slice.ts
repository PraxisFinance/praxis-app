import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import { ACHIEVEMENTS_INITIAL_STATE, createAchievementsActions } from "./actions";
import type { AchievementsSlice } from "./types";

export const createAchievementsSlice: StateCreator<ProgressStore, [], [], AchievementsSlice> = (
  set,
  get,
  api,
) => ({
  ...ACHIEVEMENTS_INITIAL_STATE,
  ...createAchievementsActions(set, get, api),
});
