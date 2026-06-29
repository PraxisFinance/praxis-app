import type { ProgressStore } from "@/stores/progress/types";
import type { AchievementCategory } from "@/shared/types/achievements";
import { mapDefinitionsToCategories } from "./mappers";
import type { AchievementsSlice } from "./types";

const EMPTY_ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [];

export function selectAchievementCategories(
  state: Pick<ProgressStore, "definitions" | "userAchievements">,
): AchievementCategory[] {
  if (state.definitions == null) return EMPTY_ACHIEVEMENT_CATEGORIES;
  return mapDefinitionsToCategories(state.definitions, state.userAchievements);
}

export function selectUserProgressStats(state: Pick<AchievementsSlice, "stats">) {
  return state.stats;
}
