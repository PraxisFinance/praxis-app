"use client";

import { AchievementCompletedDrawer } from "@/components/ProgressPage/drawers/AchievementCompletedDrawer";
import { useAchievementCompletedDrawerStore } from "@/stores/progress/achievementCompletedDrawerStore";

export function AchievementCompletedDrawerHost() {
  const open = useAchievementCompletedDrawerStore((state) => state.open);
  const achievement = useAchievementCompletedDrawerStore((state) => state.achievement);
  const setOpen = useAchievementCompletedDrawerStore((state) => state.setOpen);

  return (
    <AchievementCompletedDrawer open={open} onOpenChange={setOpen} achievement={achievement} />
  );
}
