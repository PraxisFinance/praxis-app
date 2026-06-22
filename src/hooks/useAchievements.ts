"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import type {
  AchievementPublic,
  UserAchievementView,
  UserAchievementsResponse,
  CheckAchievementDto,
  CheckResult,
} from "@/shared/types/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

async function parseApiError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as { message?: string };
    return new Error(body.message ?? res.statusText);
  } catch {
    return new Error(res.statusText);
  }
}

export function useAchievements() {
  const { address } = useAccount();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const definitionsQuery = useQuery<AchievementPublic[], Error>({
    queryKey: ["achievements-catalogue"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/achievements`);
      if (!res.ok) throw await parseApiError(res);
      return res.json() as Promise<AchievementPublic[]>;
    },
    staleTime: Infinity,
  });

  const userQuery = useQuery<UserAchievementsResponse, Error>({
    queryKey: ["achievements-me", address],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/achievements/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await parseApiError(res);
      return res.json() as Promise<UserAchievementsResponse>;
    },
    enabled: !!address,
  });

  const checkTrigger = useCallback(
    async (dto: CheckAchievementDto): Promise<CheckResult> => {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/achievements/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });
      if (!res.ok) throw await parseApiError(res);
      const result = (await res.json()) as CheckResult;

      // Merge updated achievement views into the cached user data
      queryClient.setQueryData<UserAchievementsResponse>(
        ["achievements-me", address],
        (prev) => {
          if (!prev) return prev;
          const updatedById = new Map(result.updated.map((a) => [a.id, a]));
          return {
            achievements: prev.achievements.map((a) =>
              updatedById.has(a.id) ? (updatedById.get(a.id) as UserAchievementView) : a
            ),
            totalXp: prev.totalXp + result.xpGained,
          };
        }
      );

      return result;
    },
    [address, getToken, queryClient]
  );

  const refreshUserAchievements = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: ["achievements-me", address] });
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
