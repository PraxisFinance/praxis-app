import type { EsportsGameFilterId, EsportsTimeFilterId } from "@/shared/constants/esports";
import type { EsportsMatch } from "@/shared/types/esportsMatch";

const TIME_WINDOW_MS = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "2d": 48 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
} as const satisfies Record<Exclude<EsportsTimeFilterId, "all" | "live">, number>;

/** Empty `gameIds` = all games. `null` or `"all"` for time = no time narrowing. */
export function esportsMatchPassesFilters(
  match: EsportsMatch,
  gameIds: EsportsGameFilterId[],
  timeId: EsportsTimeFilterId | null
): boolean {
  if (gameIds.length > 0 && !gameIds.includes(match.gameId)) {
    return false;
  }

  if (timeId == null || timeId === "all") {
    return true;
  }

  if (timeId === "live") {
    return match.status.kind === "live";
  }

  const windowMs = TIME_WINDOW_MS[timeId];
  const now = Date.now();
  const windowEnd = now + windowMs;

  if (match.status.kind === "live") {
    return true;
  }

  if (match.status.kind === "upcoming") {
    const raw = match.status.startsAt?.trim();
    if (!raw) return false;
    const start = new Date(raw).getTime();
    if (Number.isNaN(start)) return false;
    return start >= now && start <= windowEnd;
  }

  return false;
}
