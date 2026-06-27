"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { canUseAuthenticatedApi } from "@/lib/auth/devAuthToken";
import { useProgressAchievementsSync } from "@/hooks/progress/useProgressAchievementsSync";
import { useProgressHistorySync } from "@/hooks/progress/useProgressHistorySync";
import { useProgressLeaderboardSync } from "@/hooks/progress/useProgressLeaderboardSync";
import { useProgressStore } from "@/stores/progress/store";

/** Mount once on the Progress hub page to keep react-query and Zustand in sync. */
export function useProgressDataSync() {
  const { address } = useAccount();
  const resetUserProgress = useProgressStore((state) => state.resetUserProgress);

  useProgressAchievementsSync();
  useProgressHistorySync();
  useProgressLeaderboardSync();

  useEffect(() => {
    if (!canUseAuthenticatedApi(address)) {
      resetUserProgress();
    }
  }, [address, resetUserProgress]);
}
