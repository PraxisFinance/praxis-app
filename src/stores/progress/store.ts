import { create } from "zustand";
import { createAchievementHistorySlice } from "@/stores/progress/achievement-history/slice";
import { createAchievementsSlice } from "@/stores/progress/achievements/slice";
import { createLeaderboardSlice } from "@/stores/progress/leaderboard/slice";
import { createQuestsSlice } from "@/stores/progress/quests/slice";
import { createSharedSlice } from "@/stores/progress/shared/slice";
import type { ProgressStore } from "@/stores/progress/types";

export const useProgressStore = create<ProgressStore>()((set, get, api) => ({
  ...createSharedSlice(set, get, api),
  ...createAchievementsSlice(set, get, api),
  ...createAchievementHistorySlice(set, get, api),
  ...createLeaderboardSlice(set, get, api),
  ...createQuestsSlice(set, get, api),

  resetUserProgress: () => {
    get().resetAchievements();
    get().resetAchievementHistory();
    get().resetLeaderboard();
    get().resetQuests();
  },
}));
