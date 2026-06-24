"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import {
  applyAchievementCheckResult,
  postAchievementCheck,
} from "@/hooks/progress/achievementCheck";
import {
  fetchAchievementsCatalogue,
  fetchUserAchievements,
  parseProgressApiError,
  PROGRESS_QUERY_KEYS,
} from "@/hooks/progress/progressApi";
import type { CheckAchievementDto, CheckResult } from "@/shared/types/api";

export function useAchievements() {
  const { address } = useAccount();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const definitionsQuery = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.achievementsCatalogue,
    queryFn: fetchAchievementsCatalogue,
    staleTime: Infinity,
  });

  const userQuery = useQuery({
    queryKey: PROGRESS_QUERY_KEYS.achievementsMe(address),
    queryFn: async () => {
      const token = await getToken();
      return fetchUserAchievements(token);
    },
    enabled: !!address,
  });

  const checkTrigger = useCallback(
    async (dto: CheckAchievementDto): Promise<CheckResult> => {
      const token = await getToken();
      const result = await postAchievementCheck(token, dto);
      applyAchievementCheckResult(queryClient, address, result);
      return result;
    },
    [address, getToken, queryClient],
  );

  const refreshUserAchievements = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.achievementsMe(address) });
  }, [address, queryClient]);

  return {
    definitions: definitionsQuery.data ?? [],
    achievements: userQuery.data?.achievements ?? null,
    totalXp: userQuery.data?.totalXp ?? 0,

    definitionsLoading: definitionsQuery.isLoading,
    userLoading: userQuery.isLoading,

    definitionsError: definitionsQuery.error,
    userError: userQuery.error,

    checkTrigger,
    refreshUserAchievements,
  };
}
