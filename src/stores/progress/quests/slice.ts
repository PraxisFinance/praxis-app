import type { StateCreator } from "zustand";
import type { ProgressStore } from "@/stores/progress/types";
import type { QuestsSlice } from "./types";

export const createQuestsSlice: StateCreator<ProgressStore, [], [], QuestsSlice> = (set) => ({
  resetQuests: () => set({}),
});
