import type { CheckAchievementDto, CheckResult, UserAchievementsResponse } from "@/shared/types/api";
import type { QueryClient } from "@tanstack/react-query";
import { PROGRESS_QUERY_KEYS, fetchAchievementCheck } from "@/hooks/progress/progressApi";
import { useProgressStore } from "@/stores/progress/store";

export function mergeCheckResultIntoUserAchievements(
  prev: UserAchievementsResponse | undefined,
  result: CheckResult,
): UserAchievementsResponse | undefined {
  if (prev == null) return prev;

  const updatedById = new Map(result.updated.map((achievement) => [achievement.id, achievement]));

  return {
    ...prev,
    achievements: prev.achievements.map((achievement) =>
      updatedById.has(achievement.id)
        ? (updatedById.get(achievement.id) as (typeof prev.achievements)[number])
        : achievement,
    ),
    totalXp: prev.totalXp + result.xpGained,
  };
}

export function applyAchievementCheckResult(
  queryClient: QueryClient,
  address: string | undefined,
  result: CheckResult,
): void {
  queryClient.setQueryData<UserAchievementsResponse>(
    PROGRESS_QUERY_KEYS.achievementsMe(address),
    (prev) => mergeCheckResultIntoUserAchievements(prev, result),
  );

  useProgressStore.getState().patchFromCheckResult(result);

  void queryClient.invalidateQueries({
    queryKey: PROGRESS_QUERY_KEYS.achievementsHistory(address, useProgressStore.getState().page),
  });
}

export async function postAchievementCheck(
  token: string,
  dto: CheckAchievementDto,
): Promise<CheckResult> {
  return fetchAchievementCheck(token, dto);
}
