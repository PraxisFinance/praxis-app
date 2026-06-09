/** Implied share price label for the drawer, e.g. «20¢». */
export function formatCryptoPredictionDrawerPrice(odds: number | undefined): string {
  if (odds == null || !Number.isFinite(odds) || odds <= 0) return "—";
  const cents = Math.round(100 / odds);
  return `${cents}¢`;
}
