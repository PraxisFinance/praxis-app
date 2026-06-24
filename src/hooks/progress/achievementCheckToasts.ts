import { toast } from "sonner";
import type { CheckResult } from "@/shared/types/api";

export function showAchievementCheckToasts(result: CheckResult): void {
  if (result.newlyCompleted.length > 0) {
    for (const id of result.newlyCompleted) {
      const achievement = result.updated.find((item) => item.id === id);
      toast.success(achievement?.title ?? "Achievement unlocked!", {
        description: achievement
          ? `${achievement.description}${achievement.xpAwarded > 0 ? ` · +${achievement.xpAwarded} XP` : ""}`
          : undefined,
      });
    }
    return;
  }

  if (result.xpGained > 0) {
    toast.success(`+${result.xpGained} XP earned`);
  }
}
