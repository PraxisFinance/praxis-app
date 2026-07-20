/** Formats pool share for hub detail UI (e.g. 9.8 → «9,8%»). */
export function formatHubDetailPoolPercent(value: number): string {
  const normalized = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${normalized.replace(".", ",")}%`;
}

/** Match card title when hub detail payload is missing. */
export function hubDetailMatchDisplayTitle(nameA: string, nameB: string): string {
  return `${nameA} vs ${nameB}`;
}

/**
 * Approximate pool split from decimal odds (inverse of mapper `impliedOdds`).
 * Falls back to 50/50 when odds are missing or invalid.
 */
export function hubDetailPoolPercentsFromOdds(
  oddsA: number,
  oddsB: number,
): [number, number] {
  const weightA = Number.isFinite(oddsA) && oddsA > 0 ? 1 / oddsA : 0;
  const weightB = Number.isFinite(oddsB) && oddsB > 0 ? 1 / oddsB : 0;
  const total = weightA + weightB;
  if (total <= 0) return [50, 50];
  const percentA = Math.round((weightA / total) * 100);
  return [percentA, 100 - percentA];
}
