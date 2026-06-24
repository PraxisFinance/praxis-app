"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchAchievementsCatalogue,
  fetchUserAchievements,
  PROGRESS_QUERY_KEYS,
} from "@/hooks/progress/progressApi";
import { useProgressStore } from "@/stores/progress/store";

export function useProgressAchievementsSync() {
  const { address } = useAccount();
  const { getToken } = useAuth();

  const hydrateCatalogue = useProgressStore((state) => state.hydrateCatalogue);
  const setDefinitionsLoading = useProgressStore((state) => state.setDefinitionsLoading);
  const setDefinitionsError = useProgressStore((state) => state.setDefinitionsError);
  const hydrateUser = useProgressStore((state) => state.hydrateUser);
  const setAchievementsLoading = useProgressStore((state) => state.setAchievementsLoading);
  const setAchievementsError = useProgressStore((state) => state.setAchievementsError);

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

  useEffect(() => {
    setDefinitionsLoading(definitionsQuery.isLoading);
  }, [definitionsQuery.isLoading, setDefinitionsLoading]);

  useEffect(() => {
    setDefinitionsError(definitionsQuery.error?.message ?? null);
  }, [definitionsQuery.error, setDefinitionsError]);

  useEffect(() => {
    if (definitionsQuery.data != null) {
      hydrateCatalogue(definitionsQuery.data);
    }
  }, [definitionsQuery.data, hydrateCatalogue]);

  useEffect(() => {
    setAchievementsLoading(userQuery.isLoading);
  }, [userQuery.isLoading, setAchievementsLoading]);

  useEffect(() => {
    setAchievementsError(userQuery.error?.message ?? null);
  }, [userQuery.error, setAchievementsError]);

  useEffect(() => {
    if (userQuery.data == null) return;

    hydrateUser({
      achievements: userQuery.data.achievements,
      totalXp: userQuery.data.totalXp,
    });
  }, [userQuery.data, hydrateUser]);

  return {
    definitionsQuery,
    userQuery,
  };
}
