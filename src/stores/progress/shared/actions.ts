import type { StateCreator } from "zustand";
import { DEFAULT_PROGRESS_HUB_CATEGORY_ID } from "@/shared/constants/progressHubFilters";
import type { AchievementPublic } from "@/shared/types/api";
import type { ProgressStore } from "@/stores/progress/types";
import { mapHistoryApiResponse } from "@/stores/progress/achievement-history/mappers";
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
> = (set, get) => ({
  setActiveCategoryId: (id) => set({ activeCategoryId: id }),

  hydrateCatalogue: (definitions: AchievementPublic[]) => {
    const { historySource } = get();

    set({
      definitions,
      definitionsError: null,
      ...(historySource != null
        ? { items: mapHistoryApiResponse(historySource, definitions) }
        : {}),
    });
  },

  setDefinitionsLoading: (definitionsLoading) => set({ definitionsLoading }),

  setDefinitionsError: (definitionsError) => set({ definitionsError }),

  resetShared: () => set(SHARED_INITIAL_STATE),
});
