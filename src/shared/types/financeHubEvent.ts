/** One side of a binary finance market (Up / Down). */
export type FinanceHubBinaryOutcome = {
  id: string;
  label: string;
  poolPercent: number;
  odds?: number;
};

export type FinanceHubEvent = {
  id: string;
  assetName: string;
  assetTicker: string;
  /** Company / asset logo (square). */
  logoUrl: string;
  /** Display title, e.g. «Meta (META) Up or Down». */
  title: string;
  /** ISO 8601 — market close for «End in: …» */
  endsAt: string;
  volumeLabel?: string;
  isTradingOpen: boolean;
  outcomes: [FinanceHubBinaryOutcome, FinanceHubBinaryOutcome];
};

export function buildFinanceHubTitle(assetName: string, assetTicker: string): string {
  const ticker = assetTicker.trim();
  return ticker.length > 0 ? `${assetName} (${ticker}) Up or Down` : `${assetName} Up or Down`;
}
