import { toast } from "sonner";
import type { CheckResult } from "@/shared/types/api";
import { mapUserAchievementToCompletedDrawerData } from "@/components/ProgressPage/drawers/mapUserAchievementToCompletedDrawerData";
import { useAchievementCompletedDrawerStore } from "@/stores/progress/achievementCompletedDrawerStore";

export function showAchievementCheckToasts(result: CheckResult): void {
  if (result.newlyCompleted.length > 0) {
    const firstCompletedId = result.newlyCompleted[0];
    const achievement = result.updated.find((item) => item.id === firstCompletedId);

    if (achievement != null) {
      useAchievementCompletedDrawerStore
        .getState()
        .openDrawer(mapUserAchievementToCompletedDrawerData(achievement));
    }

    return;
  }

  if (result.xpGained > 0) {
    toast.success(`+${result.xpGained} XP earned`);
  }
}
