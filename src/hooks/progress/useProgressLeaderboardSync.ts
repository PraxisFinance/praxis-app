"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { canUseAuthenticatedApi, resolveAuthAddress } from "@/lib/auth/devAuthToken";
import { fetchProgressLeaderboard, PROGRESS_QUERY_KEYS } from "@/hooks/progress/progressApi";
import { useProgressStore } from "@/stores/progress/store";

export function useProgressLeaderboardSync() {
  const { address } = useAccount();
  const authAddress = resolveAuthAddress(address);
  const { getToken } = useAuth();

  const hydrateLeaderboard = useProgressStore((state) => state.hydrateLeaderboard);
  const setLeaderboardLoading = useProgressStore((state) => state.setLeaderboardLoading);
  const setLeaderboardError = useProgressStore((state) => state.setLeaderboardError);

  const leaderboardQuery = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.progressLeaderboard(authAddress),
    queryFn: async () => {
      const token = await getToken();
      return fetchProgressLeaderboard(token);
    },
    enabled: canUseAuthenticatedApi(address),
  });

  useEffect(() => {
    setLeaderboardLoading(leaderboardQuery.isLoading);
  }, [leaderboardQuery.isLoading, setLeaderboardLoading]);

  useEffect(() => {
    setLeaderboardError(leaderboardQuery.error?.message ?? null);
  }, [leaderboardQuery.error, setLeaderboardError]);

  useEffect(() => {
    if (leaderboardQuery.data != null) {
      hydrateLeaderboard(leaderboardQuery.data);
    }
  }, [leaderboardQuery.data, hydrateLeaderboard]);

  return { leaderboardQuery };
}
