import { DEFAULT_PROGRESS_HUB_CATEGORY_ID } from "@/shared/constants/progressHubFilters";
import type { AchievementPublic } from "@/shared/types/api";
import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import type { SharedSlice, SharedSliceState } from "./types";

export const SHARED_INITIAL_STATE: SharedSliceState = {
  activeCategoryId: DEFAULT_PROGRESS_HUB_CATEGORY_ID,
  definitions: null,
  definitionsLoading: false,
  definitionsError: null,
};

export const createSharedActions: StateCreator<
  ProgressStore,
  [],
  [],
  Pick<
    SharedSlice,
    | "setActiveCategoryId"
    | "hydrateCatalogue"
    | "setDefinitionsLoading"
    | "setDefinitionsError"
    | "resetShared"
  >
> = (set) => ({
  setActiveCategoryId: (id) => set({ activeCategoryId: id }),

  hydrateCatalogue: (definitions: AchievementPublic[]) =>
    set({ definitions, definitionsError: null }),

  setDefinitionsLoading: (definitionsLoading) => set({ definitionsLoading }),

  setDefinitionsError: (definitionsError) => set({ definitionsError }),

  resetShared: () => set(SHARED_INITIAL_STATE),
});
