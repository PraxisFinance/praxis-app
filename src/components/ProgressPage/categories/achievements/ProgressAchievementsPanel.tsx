import { ACHIEVEMENTS_COMMON_STATS_MOCK } from "@/shared/constants/achievements";
import { AchievementsCommonStats } from "@/components/ProgressPage/categories/achievements/AchievementsCommonStats";
import { AchievementsCategoryList } from "@/components/ProgressPage/categories/achievements/AchievementsCategoryList";
import { SectionHeader } from "@/components/ui";

export function ProgressAchievementsPanel() {
  const { level, currentXp, xpToNextLevel, description } = ACHIEVEMENTS_COMMON_STATS_MOCK;

  return (
    <div className="flex flex-col gap-4">
      <AchievementsCommonStats
        level={level}
        currentXp={currentXp}
        xpToNextLevel={xpToNextLevel}
        description={description}
      />
      <SectionHeader>Achievements</SectionHeader>
      <AchievementsCategoryList />
    </div>
  );
}
