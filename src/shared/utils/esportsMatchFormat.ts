import { format } from "date-fns";
import type { EsportsMatchStatus } from "@/shared/types/esportsMatch";

export function getEsportsMatchStatusLine(status: EsportsMatchStatus): {
  text: string;
  showLiveDot: boolean;
} {
  switch (status.kind) {
    case "live":
      return { text: status.label ?? "Live now", showLiveDot: true };
    case "upcoming":
      return {
        text:
          status.label ??
          (status.startsAt
            ? format(new Date(status.startsAt), "MMM d · HH:mm")
            : "Upcoming"),
        showLiveDot: false,
      };
    case "finished":
      return { text: status.label ?? "Final", showLiveDot: false };
  }
}

export function formatEsportsOdds(value: number): string {
  return String(parseFloat(value.toFixed(2)));
}
