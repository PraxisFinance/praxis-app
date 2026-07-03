import type { AchievementHistoryApiResponse } from "@/stores/progress/achievement-history/types";
import { normalizeAchievementHistoryResponse } from "@/stores/progress/achievement-history/normalize";
import type { ProgressLeaderboardHydration } from "@/stores/progress/leaderboard/types";
import { mapLeaderboardApiResponse } from "@/stores/progress/leaderboard/mappers";
import { normalizeProgressLeaderboardResponse } from "@/stores/progress/leaderboard/normalize";
import type {
  AchievementPublic,
  CheckAchievementDto,
  CheckResult,
  UserAchievementsResponse,
} from "@/shared/types/api";

export const PROGRESS_QUERY_KEYS = {
  achievementsCatalogue: ["achievements-catalogue"] as const,
  achievementsMe: (address: string | undefined) => ["achievements-me", address] as const,
  achievementsHistory: (address: string | undefined) => ["achievements-history", address] as const,
  progressLeaderboard: (address: string | undefined) =>
    ["progress-leaderboard", address] as const,
} as const;

export const PROGRESS_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export async function parseProgressApiError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as { message?: string };
    return new Error(body.message ?? res.statusText);
  } catch {
    return new Error(res.statusText);
  }
}

export async function fetchAchievementsCatalogue(): Promise<AchievementPublic[]> {
  const res = await fetch(`${PROGRESS_BACKEND_URL}/achievements`);
  if (!res.ok) throw await parseProgressApiError(res);
  return res.json() as Promise<AchievementPublic[]>;
}

export async function fetchUserAchievements(token: string): Promise<UserAchievementsResponse> {
  const res = await fetch(`${PROGRESS_BACKEND_URL}/achievements/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await parseProgressApiError(res);
  return res.json() as Promise<UserAchievementsResponse>;
}

export async function fetchAchievementHistory(
  token: string,
): Promise<AchievementHistoryApiResponse> {
  const res = await fetch(`${PROGRESS_BACKEND_URL}/achievements/me/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await parseProgressApiError(res);
  const raw: unknown = await res.json();
  return normalizeAchievementHistoryResponse(raw);
}

export async function fetchProgressLeaderboard(
  token: string,
  limit = 50,
): Promise<ProgressLeaderboardHydration> {
  const params = new URLSearchParams({ limit: String(limit) });

  const res = await fetch(`${PROGRESS_BACKEND_URL}/achievements/leaderboard?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await parseProgressApiError(res);
  const raw: unknown = await res.json();
  return mapLeaderboardApiResponse(normalizeProgressLeaderboardResponse(raw));
}

export async function fetchAchievementCheck(
  token: string,
  dto: CheckAchievementDto,
): Promise<CheckResult> {
  const res = await fetch(`${PROGRESS_BACKEND_URL}/achievements/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw await parseProgressApiError(res);
  return res.json() as Promise<CheckResult>;
}
