import { format } from "date-fns";

export { getPoliticsEventEndLine as getCryptoHubCardEndLine } from "@/shared/utils/politicsHubEventFormat";

/** Title for above/below hub cards, e.g. «AERO above __ on Feb 27?». */
export function buildCryptoAboveBelowHubTitle(assetSymbol: string, endsAt: string): string {
  const d = new Date(endsAt.trim());
  const datePart = Number.isNaN(d.getTime()) ? "—" : format(d, "d MMM");
  return `${assetSymbol.trim()} above __ on ${datePart}?`;
}

/** Strike-row probability label, e.g. «100%» or «< 1%». */
export function formatStrikeProbabilityLabel(poolPercent?: number): string {
  if (poolPercent === undefined || Number.isNaN(poolPercent)) return "—";
  if (poolPercent < 1) return "< 1%";
  if (poolPercent >= 99.5) return "100%";
  const rounded = Math.round(poolPercent * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}%`;
}
