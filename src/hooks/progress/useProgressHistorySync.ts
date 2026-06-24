"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { fetchAchievementHistory, PROGRESS_QUERY_KEYS } from "@/hooks/progress/progressApi";
import { useProgressStore } from "@/stores/progress/store";

export function useProgressHistorySync() {
  const { address } = useAccount();
  const { getToken } = useAuth();
  const page = useProgressStore((state) => state.page);

  const hydrateHistory = useProgressStore((state) => state.hydrateHistory);
  const setHistoryLoading = useProgressStore((state) => state.setHistoryLoading);
  const setHistoryError = useProgressStore((state) => state.setHistoryError);

  const historyQuery = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.achievementsHistory(address, page),
    queryFn: async () => {
      const token = await getToken();
      return fetchAchievementHistory(token, page);
    },
    enabled: !!address,
  });

  useEffect(() => {
    setHistoryLoading(historyQuery.isLoading);
  }, [historyQuery.isLoading, setHistoryLoading]);

  useEffect(() => {
    setHistoryError(historyQuery.error?.message ?? null);
  }, [historyQuery.error, setHistoryError]);

  useEffect(() => {
    if (historyQuery.data != null) {
      hydrateHistory(historyQuery.data);
    }
  }, [historyQuery.data, hydrateHistory]);

  return { historyQuery };
}
