export function formatHistoryTimestamp(ms: number): string {
  const d = new Date(ms);
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const datePart = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return `${time}, ${datePart}`;
}

export function formatSignedHistoryAmount(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}
