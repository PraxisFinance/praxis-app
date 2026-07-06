"use client";

import { useLiveDataStore, type OraclePriceData } from "@/stores/liveDataStore";

/**
 * Returns the latest oracle price for a market identified by its conditionId
 * (used as the market address) or by slug.
 *
 * Looks up by both `conditionId` (as market address) and `slug`. Returns
 * `null` when no update has been received for this market yet.
 */
export function useOraclePrice(
  conditionId: string | null | undefined,
  slug?: string | null,
): OraclePriceData | null {
  return useLiveDataStore((s) => {
    if (conditionId) {
      const hit = s.oraclePrices[conditionId.toLowerCase()];
      if (hit) return hit;
    }
    if (slug) {
      const hit = s.oraclePrices[slug];
      if (hit) return hit;
    }
    return null;
  });
}

/** Formats an oracle price value as a human-readable string. */
export function formatOraclePrice(value: number): string {
  if (value >= 1_000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  // Small values (probabilities, sub-dollar prices): show more decimals.
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
}
