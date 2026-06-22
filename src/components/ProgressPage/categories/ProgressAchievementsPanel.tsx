import { ACHIEVEMENTS_COMMON_STATS_MOCK } from "@/shared/constants/achievements";
import { AchievmentsCommonStats } from "./achievments/AchievmentsCommonStats";
import { AchievementsCategoryList } from "./achievments/AchievementsCategoryList";
import { SectionHeader } from "@/components/ui";

export function ProgressAchievementsPanel() {
  const { level, currentXp, xpToNextLevel, description } = ACHIEVEMENTS_COMMON_STATS_MOCK;

  return (
    <div className="flex flex-col gap-4">
      <AchievmentsCommonStats
        level={level}
        currentXp={currentXp}
        xpToNextLevel={xpToNextLevel}
        description={description}
      />
      <SectionHeader>Achievements</SectionHeader>
      <AchievementsCategoryList />
      <SectionHeader>Multiple Achievements</SectionHeader>
    </div>
  );
}
