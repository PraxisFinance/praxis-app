import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import { mapUserProgressStats } from "./mappers";
import type {
  AchievementsSlice,
  AchievementsSliceState,
  UserAchievementsHydration,
} from "./types";

export const ACHIEVEMENTS_INITIAL_STATE: AchievementsSliceState = {
  userAchievements: null,
  stats: null,
  loading: false,
  error: null,
};

export const createAchievementsActions: StateCreator<
  ProgressStore,
  [],
  [],
  Pick<
    AchievementsSlice,
    | "hydrateUser"
    | "patchFromCheckResult"
    | "setAchievementsLoading"
    | "setAchievementsError"
    | "resetAchievements"
  >
> = (set, get) => ({
  hydrateUser: (payload: UserAchievementsHydration) =>
    set({
      userAchievements: payload.achievements,
      stats: mapUserProgressStats(payload),
      error: null,
    }),

  patchFromCheckResult: (result) => {
    const { userAchievements, stats } = get();
    if (userAchievements == null || stats == null) return;

    const updatedById = new Map(result.updated.map((achievement) => [achievement.id, achievement]));

    set({
      userAchievements: userAchievements.map((achievement) =>
        updatedById.has(achievement.id)
          ? (updatedById.get(achievement.id) as (typeof userAchievements)[number])
          : achievement,
      ),
      stats: {
        ...stats,
        totalXp: stats.totalXp + result.xpGained,
        currentXp: stats.currentXp + result.xpGained,
      },
    });
  },

  setAchievementsLoading: (loading) => set({ loading }),

  setAchievementsError: (error) => set({ error }),

  resetAchievements: () => set(ACHIEVEMENTS_INITIAL_STATE),
});
