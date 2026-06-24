import type { ProgressStore } from "@/stores/progress/types";
import { mapDefinitionsToCategories } from "./mappers";
import type { AchievementsSlice } from "./types";

export function selectAchievementCategories(
  state: Pick<ProgressStore, "definitions" | "userAchievements">,
) {
  if (state.definitions == null) return [];
  return mapDefinitionsToCategories(state.definitions, state.userAchievements);
}

export function selectUserProgressStats(state: Pick<AchievementsSlice, "stats">) {
  return state.stats;
}
