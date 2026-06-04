/** One side of a binary politics market (Yes / No). */
export type PoliticsHubBinaryOutcome = {
  id: string;
  label: string;
  poolPercent: number;
  odds?: number;
};

export type PoliticsHubEvent = {
  id: string;
  /** Market question, e.g. «Trump out as President before 2027?» */
  title: string;
  /** Square thumbnail (person / event image). */
  thumbnailUrl: string;
  /** ISO 8601 — market close for «End in: …» */
  endsAt: string;
  volumeLabel?: string;
  isTradingOpen: boolean;
  outcomes: [PoliticsHubBinaryOutcome, PoliticsHubBinaryOutcome];
};
