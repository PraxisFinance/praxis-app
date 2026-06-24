"use client";

import { useEffect } from "react";
import {
  LEADERBOARD_TOP_USERS,
} from "@/shared/constants/leaderboard";
import { useProgressStore } from "@/stores/progress/store";
import type { ProgressLeaderboardEntry } from "@/stores/progress/leaderboard/types";

const MOCK_PROGRESS_LEADERBOARD: ProgressLeaderboardEntry[] = LEADERBOARD_TOP_USERS.map(
  (user, index) => ({
    id: `progress-lb-${index + 1}`,
    rank: index + 1,
    name: user.name,
    address: `0x${String(index + 1).padStart(40, "0")}` as `0x${string}`,
    score: user.score,
  }),
);

/** Temporary mock hydration until the Progress leaderboard API is available. */
export function useProgressLeaderboardSync() {
  const hydrateLeaderboard = useProgressStore((state) => state.hydrateLeaderboard);
  const setLeaderboardLoading = useProgressStore((state) => state.setLeaderboardLoading);

  useEffect(() => {
    setLeaderboardLoading(true);

    hydrateLeaderboard({
      entries: MOCK_PROGRESS_LEADERBOARD,
      userRank: null,
    });

    setLeaderboardLoading(false);
  }, [hydrateLeaderboard, setLeaderboardLoading]);
}
