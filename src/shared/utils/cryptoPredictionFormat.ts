import { format, isThisYear, isToday, isTomorrow } from "date-fns";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";

function formatCryptoWhenForCard(iso: string): { datePart: string; timePart: string } | null {
  const raw = iso.trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;

  const datePart = isToday(d)
    ? "Today"
    : isTomorrow(d)
      ? "Tomorrow"
      : isThisYear(d)
        ? format(d, "d MMM")
        : format(d, "d MMM yyyy");
  const timePart = format(d, "h:mm a");
  return { datePart, timePart };
}

/** Строка «End in: …» для шапки карточки. */
export function getCryptoPredictionEndLine(endsAt: string): string {
  const parts = formatCryptoWhenForCard(endsAt);
  if (!parts) return "—";
  return `End in: ${parts.datePart}, ${parts.timePart}`;
}

/**
 * Статус под прогресс-баром / в футере: live (с точкой), upcoming («Starts at…» или подпись), ended.
 */
export function getCryptoPredictionStatusFooter(prediction: CryptoPrediction): {
  showLiveDot: boolean;
  text: string;
} {
  const { status } = prediction;
  switch (status.kind) {
    case "live":
      return { showLiveDot: true, text: status.label ?? "Live now" };
    case "upcoming": {
      const fromIso = status.startsAt?.trim()
        ? formatCryptoWhenForCard(status.startsAt)
        : null;
      if (fromIso) {
        return {
          showLiveDot: false,
          text: `Starts at: ${fromIso.datePart}, ${fromIso.timePart}`,
        };
      }
      const label = status.label?.trim();
      if (label) return { showLiveDot: false, text: label };
      return { showLiveDot: false, text: "Upcoming" };
    }
    case "ended": {
      const fromResolution = status.resolutionSummary?.trim();
      const fromLabelOnly = status.label?.trim();
      const summary =
        fromResolution && fromResolution.length > 0
          ? fromResolution
          : fromLabelOnly && fromLabelOnly.length > 0
            ? fromLabelOnly
            : undefined;
      return {
        showLiveDot: false,
        text: summary ? `Ended · ${summary}` : "Ended",
      };
    }
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
