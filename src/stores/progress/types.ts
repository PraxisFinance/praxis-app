import type { AchievementHistorySlice } from "@/stores/progress/achievement-history/types";
import type { AchievementsSlice } from "@/stores/progress/achievements/types";
import type { LeaderboardSlice } from "@/stores/progress/leaderboard/types";
import type { QuestsSlice } from "@/stores/progress/quests/types";
import type { SharedSlice } from "@/stores/progress/shared/types";

export type ProgressStore = SharedSlice &
  AchievementsSlice &
  AchievementHistorySlice &
  LeaderboardSlice &
  QuestsSlice & {
    resetUserProgress: () => void;
  };
