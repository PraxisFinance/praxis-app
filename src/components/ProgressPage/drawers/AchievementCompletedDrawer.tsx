"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import {
  ACHIEVEMENT_COMPLETED_IMAGE_SRC,
  type AchievementCompletedDrawerData,
} from "@/components/ProgressPage/drawers/achievementCompletedTypes";
import { buildProgressHubRoute } from "@/lib/routes";
import { useProgressStore } from "@/stores/progress/store";

export interface AchievementCompletedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: AchievementCompletedDrawerData | null;
  onShowAchievements?: () => void;
}

export function AchievementCompletedDrawer({
  open,
  onOpenChange,
  achievement,
  onShowAchievements,
}: AchievementCompletedDrawerProps) {
  const router = useRouter();

  if (achievement == null) return null;

  function handleShowAchievements() {
    onShowAchievements?.();
    useProgressStore.getState().setActiveCategoryId("achievements");
    router.push(buildProgressHubRoute("achievements"));
    onOpenChange(false);
  }

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <Button
          type="button"
          variant="primary"
          size="action"
          className="text-header-5 h-12 font-medium"
          onClick={handleShowAchievements}
        >
          Show my achievements
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-[132px] w-full max-w-[280px]">
          <Image
            src={ACHIEVEMENT_COMPLETED_IMAGE_SRC}
            alt=""
            fill
            className="object-contain"
            sizes="280px"
            priority
          />
        </div>

        <div className="flex w-full flex-col gap-4">
          <InfoRow
            label="Points earned:"
            value={`${achievement.xpEarned} XP`}
            className="border-main-grayPurple/60 border-b pb-4 [&_.info-label]:text-main-darkPurple/70 [&_.info-value]:text-header-5 [&_.info-value]:font-semibold"
          />

          <div className="flex flex-col gap-3">
            <InfoRow
              label="Achievement:"
              value={achievement.title}
              className="[&_.info-label]:text-main-darkPurple/70 [&_.info-value]:text-main-darkPurple [&_.info-value]:text-right [&_.info-value]:font-medium"
            />
            <InfoRow
              label="Achievement type:"
              value={achievement.categoryLabel}
              className="[&_.info-label]:text-main-darkPurple/70 [&_.info-value]:text-main-darkPurple [&_.info-value]:text-right [&_.info-value]:font-medium"
            />
          </div>
        </div>
      </div>
    </DrawerShell>
  );
}
