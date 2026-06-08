/** One side of a binary tech market (Yes / No). */
export type TechHubBinaryOutcome = {
  id: string;
  label: string;
  poolPercent: number;
  odds?: number;
};

export type TechHubEvent = {
  id: string;
  /** Market question, e.g. «Will GPT-5 launch before July 2026?» */
  title: string;
  /** Square thumbnail (product / company image). */
  thumbnailUrl: string;
  /** ISO 8601 — market close for «End in: …» */
  endsAt: string;
  volumeLabel?: string;
  isTradingOpen: boolean;
  outcomes: [TechHubBinaryOutcome, TechHubBinaryOutcome];
};
