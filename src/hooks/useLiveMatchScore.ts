"use client";

import { useLiveDataStore, type LiveMatchScore } from "@/stores/liveDataStore";

function useMatchScore(
  field: "sportScores" | "esportsScores",
  externalMatchId: string | undefined,
): LiveMatchScore | null {
  return useLiveDataStore((s) =>
    externalMatchId != null ? (s[field][externalMatchId] ?? null) : null
  );
}

/**
 * Returns the latest live score for a sport match by its external match ID,
 * or `null` if no update has been received yet.
 *
 * @param externalMatchId  Value of `EventMetadata.matchId` stored on the pool.
 */
export function useLiveSportScore(externalMatchId: string | undefined): LiveMatchScore | null {
  return useMatchScore("sportScores", externalMatchId);
}

/**
 * Returns the latest live score for an esports match by its external match ID,
 * or `null` if no update has been received yet.
 *
 * @param externalMatchId  Value of `EventMetadata.matchId` stored on the pool.
 */
export function useLiveEsportsScore(externalMatchId: string | undefined): LiveMatchScore | null {
  return useMatchScore("esportsScores", externalMatchId);
}
