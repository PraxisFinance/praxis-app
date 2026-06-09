/** Parses hub above/below outcome ids, e.g. `s1:yes` or `r2:no`. */
export function parseCryptoAboveBelowOutcomeId(
  outcomeId: string,
): { strikeId: string; side: "yes" | "no" } | null {
  const separatorIndex = outcomeId.lastIndexOf(":");
  if (separatorIndex <= 0) return null;

  const strikeId = outcomeId.slice(0, separatorIndex);
  const side = outcomeId.slice(separatorIndex + 1);

  if (side !== "yes" && side !== "no") return null;
  if (strikeId.length === 0) return null;

  return { strikeId, side };
}

export function buildCryptoAboveBelowOutcomeId(
  strikeId: string,
  side: "yes" | "no",
): string {
  return `${strikeId}:${side}`;
}
