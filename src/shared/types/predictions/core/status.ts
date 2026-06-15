/** Lifecycle status shared across predictions hub list items. */
export type PredictionStatus =
  | { kind: "live"; label?: string }
  | { kind: "upcoming"; label?: string; startsAt?: string }
  | { kind: "locked"; label?: string }
  | { kind: "resolving"; label?: string }
  | {
      kind: "ended";
      label?: string;
      endedAt?: string;
      resolutionSummary?: string;
    }
  | { kind: "finished"; label?: string };

/** @deprecated Use `PredictionStatus`. */
export type CryptoPredictionStatus = PredictionStatus;

/** @deprecated Use `PredictionStatus`. */
export type EsportsMatchStatus = PredictionStatus;
