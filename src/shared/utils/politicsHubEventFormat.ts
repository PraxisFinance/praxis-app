import { format, isThisYear, isToday, isTomorrow } from "date-fns";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";

function formatPoliticsEndDate(iso: string): string | null {
  const raw = iso.trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;

  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return isThisYear(d) ? format(d, "d MMM") : format(d, "d MMM yyyy");
}

/** Card header line, e.g. «End in: 27 Feb». */
export function getPoliticsEventEndLine(endsAt: string): string {
  const datePart = formatPoliticsEndDate(endsAt);
  if (!datePart) return "—";
  return `End in: ${datePart}`;
}

/** Display pool share — mock uses comma decimals (9,8%). */
export function formatPoliticsPoolPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(".", ",");
  return `${text}%`;
}

/** Drawer outcome card copy (matches politics hub mock). */
export function getPoliticsDrawerInfoLines(
  event: Pick<PoliticsHubEvent, "title">,
  selectedOutcomeLabel: string,
): { primaryQuestion: string; secondaryMuted: string } {
  const label = selectedOutcomeLabel.trim().toUpperCase();
  const title = event.title.trim();

  return {
    primaryQuestion: `Outcome: ${label} ${title}`,
    secondaryMuted: title,
  };
}
