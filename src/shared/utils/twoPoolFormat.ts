import { format, isThisYear, isToday, isTomorrow } from "date-fns";
import {
  TWO_POOL_NOT_DEFINED_NUM,
  TWO_POOL_NOT_DEFINED_STR,
} from "@/shared/constants/twoPoolSentinels";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";

function formatTwoPoolEndDate(iso: string): string | null {
  const raw = iso.trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;

  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return isThisYear(d) ? format(d, "d MMM") : format(d, "d MMM yyyy");
}

/** Card header line, e.g. «End in: 27 Feb». */
export function getTwoPoolEndLine(endsAt: string): string {
  const datePart = formatTwoPoolEndDate(endsAt);
  if (!datePart) return "—";
  return `End in: ${datePart}`;
}

function formatApyPercent(value: number): string | null {
  if (value === TWO_POOL_NOT_DEFINED_NUM || !Number.isFinite(value)) return null;
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}%`;
}

/**
 * Current APY for hub cards: prefer parsed `actualRateRaw`, else `targetApyPercent`.
 */
export function formatTwoPoolCurrentApy(pool: TwoPool): string {
  const raw = pool.actualRateRaw.trim();
  if (raw && raw !== TWO_POOL_NOT_DEFINED_STR) {
    const asNumber = Number(raw);
    if (Number.isFinite(asNumber)) {
      // Indexer may send a fraction (0.031) or already-percent (3.1).
      const percent = asNumber > 0 && asNumber < 1 ? asNumber * 100 : asNumber;
      const formatted = formatApyPercent(percent);
      if (formatted) return formatted;
    }
  }

  return formatApyPercent(pool.targetApyPercent) ?? "—";
}

export function formatTwoPoolPredictedApy(pool: TwoPool): string {
  return formatApyPercent(pool.predictedApyPercent) ?? "—";
}

export function getTwoPoolProtocolLabel(pool: TwoPool): string {
  const fromDescription = pool.description?.trim();
  if (fromDescription && fromDescription !== TWO_POOL_NOT_DEFINED_STR) {
    return fromDescription;
  }
  return "Praxis";
}

export function formatTwoPoolSideLabel(side: TwoPoolSide): string {
  return side === "stable" ? "Stable" : "Elevated";
}

export function getTwoPoolDetailBreadcrumb(): string {
  return "Yield Predictions • 2-pools";
}
