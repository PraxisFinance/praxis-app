"use client";

import { useEffect } from "react";
import {
  LEADERBOARD_TOP_USERS,
  LEADERBOARD_YOUR_PLACE,
} from "@/shared/constants/leaderboard";
import { useProgressStore } from "@/stores/progress/store";
import type { ProgressLeaderboardEntry } from "@/stores/progress/leaderboard/types";

const MOCK_PROGRESS_LEADERBOARD_ENTRIES: ProgressLeaderboardEntry[] = LEADERBOARD_TOP_USERS.map(
  (user, index) => ({
    id: user.id,
    rank: index + 1,
    name: user.name,
    address: `0x${String(index + 1).padStart(40, "0")}` as `0x${string}`,
    accountLevel: user.accountLevel,
    score: user.score,
  }),
);

const MOCK_PROGRESS_USER_ENTRY: ProgressLeaderboardEntry = {
  id: LEADERBOARD_YOUR_PLACE.id,
  rank: LEADERBOARD_YOUR_PLACE.rank,
  name: LEADERBOARD_YOUR_PLACE.name,
  address: "0x0000000000000000000000000000000000000000",
  accountLevel: LEADERBOARD_YOUR_PLACE.accountLevel,
  score: LEADERBOARD_YOUR_PLACE.score,
};

/** Temporary mock hydration until the Progress leaderboard API is available. */
export function useProgressLeaderboardSync() {
  const hydrateLeaderboard = useProgressStore((state) => state.hydrateLeaderboard);
  const setLeaderboardLoading = useProgressStore((state) => state.setLeaderboardLoading);

  useEffect(() => {
    setLeaderboardLoading(true);

    hydrateLeaderboard({
      entries: MOCK_PROGRESS_LEADERBOARD_ENTRIES,
      userEntry: MOCK_PROGRESS_USER_ENTRY,
      userRank: null,
    });

    setLeaderboardLoading(false);
  }, [hydrateLeaderboard, setLeaderboardLoading]);
}
