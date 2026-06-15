import { format, isThisYear, isToday, isTomorrow } from "date-fns";
import type { EsportsMatchStatus } from "@/shared/types/esportsMatch";

export function getEsportsMatchStatusLine(status: EsportsMatchStatus): {
  text: string;
  showLiveDot: boolean;
} | null {
  switch (status.kind) {
    case "live":
      return { text: status.label ?? "Live now", showLiveDot: true };
    case "upcoming":
      return null;
    case "finished":
      return { text: status.label ?? "Final", showLiveDot: false };
    case "locked":
      return { text: status.label ?? "Locked", showLiveDot: false };
    case "resolving":
      return { text: status.label ?? "Resolving", showLiveDot: false };
    case "ended":
      return { text: status.label ?? "Ended", showLiveDot: false };
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

/**
 * First line for upcoming matches: Today / Tomorrow / formatted date, or fallback when `startsAt` is missing.
 */
export function getEsportsUpcomingDateLabel(
  startsAt: string | undefined,
  fallbackLabel?: string
): string {
  const fb = fallbackLabel?.trim();
  const start = startsAt?.trim();

  if (!start) {
    return fb && fb.length > 0 ? fb : "Upcoming";
  }
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) {
    return fb && fb.length > 0 ? fb : "Upcoming";
  }
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return isThisYear(d) ? format(d, "MMM d") : format(d, "MMM d, yyyy");
}

/** Second line for upcoming matches — local time, plain text (no wrapper styling here). */
export function getEsportsUpcomingTimeLabel(startsAt: string | undefined): string {
  const start = startsAt?.trim();
  if (!start) return "—";
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "HH:mm");
}

export function formatEsportsOdds(value: number): string {
  return String(parseFloat(value.toFixed(2)));
}
