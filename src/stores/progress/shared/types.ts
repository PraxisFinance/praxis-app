import type { ProgressHubCategoryId } from "@/shared/constants/progressHubFilters";
import type { AchievementPublic } from "@/shared/types/api";

export interface SharedSliceState {
  activeCategoryId: ProgressHubCategoryId;
  definitions: AchievementPublic[] | null;
  definitionsLoading: boolean;
  definitionsError: string | null;
}

export interface SharedSliceActions {
  setActiveCategoryId: (id: ProgressHubCategoryId) => void;
  hydrateCatalogue: (definitions: AchievementPublic[]) => void;
  setDefinitionsLoading: (loading: boolean) => void;
  setDefinitionsError: (error: string | null) => void;
  resetShared: () => void;
}

export type SharedSlice = SharedSliceState & SharedSliceActions;
