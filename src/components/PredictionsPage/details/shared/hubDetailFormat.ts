/** Formats pool share for hub detail UI (e.g. 9.8 → «9,8%»). */
export function formatHubDetailPoolPercent(value: number): string {
  const normalized = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${normalized.replace(".", ",")}%`;
}
