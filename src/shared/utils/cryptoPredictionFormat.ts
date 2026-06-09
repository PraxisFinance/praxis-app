import { format, isThisYear, isToday, isTomorrow } from "date-fns";
import type {
  CryptoPrediction,
  CryptoPredictionAboveBelow,
  CryptoPredictionStatus,
  CryptoStrikeBinary,
} from "@/shared/types/cryptoPrediction";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLeadingAssetSymbol(title: string, symbol: string): string {
  const sym = symbol.trim();
  if (!sym) return title.trim();
  return title.replace(new RegExp(`^${escapeRegExp(sym)}\\s+`, "i"), "").trim();
}

/** Дата в дровере прогноза, напр. «27 February». */
export function formatCryptoDrawerEndDate(endsAt: string): string {
  const raw = endsAt.trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "d MMMM");
}

/** Две строки блока-описания в дровере (как в макете). */
export function getCryptoDrawerInfoLines(
  prediction: CryptoPrediction,
  selectedOutcomeLabel: string
): { primaryQuestion: string; secondaryMuted: string } {
  const dateStr = formatCryptoDrawerEndDate(prediction.endsAt);
  const tail = stripLeadingAssetSymbol(prediction.title, prediction.assetSymbol);
  const topic = tail.length > 0 ? tail : prediction.title.trim();
  const symbol = prediction.assetSymbol.trim();
  const symPrefix = symbol ? `$${symbol} ` : "";
  return {
    primaryQuestion: `Outcome: ${symPrefix}${selectedOutcomeLabel} at ${dateStr}?`,
    secondaryMuted: `${symPrefix}${topic} at ${dateStr}?`,
  };
}

/** Drawer copy for an above/below strike row (Yes / No on a price level). */
export function getCryptoAboveBelowDrawerInfoLines(
  prediction: CryptoPredictionAboveBelow,
  strike: CryptoStrikeBinary,
  side: "yes" | "no",
): { primaryQuestion: string; secondaryMuted: string } {
  const dateStr = formatCryptoDrawerEndDate(prediction.endsAt);
  const symbol = prediction.assetSymbol.trim();
  const symPrefix = symbol ? `$${symbol} ` : "";
  const sideLabel = side === "yes" ? "Yes" : "No";
  const marketTitle = prediction.title.trim();

  return {
    primaryQuestion: `Outcome: ${symPrefix}${sideLabel} · ${strike.targetLabel} at ${dateStr}?`,
    secondaryMuted: marketTitle.length > 0 ? marketTitle : `${symPrefix}above/below at ${dateStr}?`,
  };
}

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
 * Принимает `CryptoPredictionStatus` напрямую, чтобы переиспользоваться и для TwoPool-карточек.
 */
export function getCryptoPredictionStatusFooter(status: CryptoPredictionStatus): {
  showLiveDot: boolean;
  text: string;
} {
  switch (status.kind) {
    case "live":
      return { showLiveDot: true, text: status.label ?? "Live now" };
    case "upcoming": {
      const fromIso = status.startsAt?.trim() ? formatCryptoWhenForCard(status.startsAt) : null;
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
    case "locked": {
      const t = status.label?.trim();
      return { showLiveDot: false, text: t && t.length > 0 ? t : "Locked" };
    }
    case "resolving": {
      const t = status.label?.trim();
      return {
        showLiveDot: false,
        text: t && t.length > 0 ? t : "Resolution in process",
      };
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
