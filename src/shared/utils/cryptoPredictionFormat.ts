import { format, isThisYear, isToday, isTomorrow } from "date-fns";
import type { CryptoPredictionStatus } from "@/shared/types/cryptoPrediction";

/** Строка «End in: …» для шапки карточки. */
export function getCryptoPredictionEndLine(endsAt: string): string {
  const raw = endsAt.trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";

  const datePart = isToday(d)
    ? "Today"
    : isTomorrow(d)
      ? "Tomorrow"
      : isThisYear(d)
        ? format(d, "d MMM")
        : format(d, "d MMM yyyy");
  const timePart = format(d, "h:mm a");
  return `End in: ${datePart}, ${timePart}`;
}

/** Нижняя строка статуса (live с точкой, итог для ended). Для upcoming — null. */
export function getCryptoPredictionStatusFooter(status: CryptoPredictionStatus): {
  showLiveDot: boolean;
  text: string;
} | null {
  switch (status.kind) {
    case "live":
      return { showLiveDot: true, text: status.label ?? "Live now" };
    case "ended":
      return {
        showLiveDot: false,
        text: status.label ?? status.resolutionSummary ?? "Ended",
      };
    default:
      return null;
  }
}
