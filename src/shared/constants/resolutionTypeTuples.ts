export const RESOLUTION_TUPLES = [
  { value: "Up/Down", inFavor: "Up", against: "Down" },
  { value: "Above/Below", inFavor: "Above", against: "Below" },
  { value: "In Range/Out of Range", inFavor: "In Range", against: "Out of Range" },
  { value: "Will Hit/Will Not Hit", inFavor: "Will Hit", against: "Will Not Hit" },
] as const;

export type ResolutionTupleValue = (typeof RESOLUTION_TUPLES)[number]["value"];

const TUPLE_BY_VALUE = new Map<string, (typeof RESOLUTION_TUPLES)[number]>(
  RESOLUTION_TUPLES.map((t) => [t.value, t])
);

/** Labels for the two binary sides when `Event.resolutionTypeTuple` matches a known tuple `value`. */
export function outcomeLabelsFromResolutionTypeTuple(
  resolutionTypeTuple: string | null | undefined
): { inFavor: string; against: string } | null {
  const key = resolutionTypeTuple?.trim();
  if (!key) return null;
  const row = TUPLE_BY_VALUE.get(key);
  if (!row) return null;
  return { inFavor: row.inFavor, against: row.against };
}
