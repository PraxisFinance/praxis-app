import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import { createSharedActions, SHARED_INITIAL_STATE } from "./actions";
import type { SharedSlice } from "./types";

export const createSharedSlice: StateCreator<ProgressStore, [], [], SharedSlice> = (
  set,
  get,
  api,
) => ({
  ...SHARED_INITIAL_STATE,
  ...createSharedActions(set, get, api),
});
