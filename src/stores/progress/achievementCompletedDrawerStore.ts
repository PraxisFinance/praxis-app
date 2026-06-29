import { create } from "zustand";
import type { AchievementCompletedDrawerData } from "@/components/ProgressPage/drawers/achievementCompletedTypes";

interface AchievementCompletedDrawerState {
  open: boolean;
  achievement: AchievementCompletedDrawerData | null;
  openDrawer: (achievement: AchievementCompletedDrawerData) => void;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

export const useAchievementCompletedDrawerStore = create<AchievementCompletedDrawerState>((set) => ({
  open: false,
  achievement: null,

  openDrawer: (achievement) => set({ open: true, achievement }),

  setOpen: (open) =>
    set((state) => ({
      open,
      achievement: open ? state.achievement : null,
    })),

  reset: () => set({ open: false, achievement: null }),
}));
