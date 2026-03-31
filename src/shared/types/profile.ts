// ── Predictions overall stats ──────────────────────────────────────────────

export type MatchStatKind = "won" | "lost" | "pending";
export type CurrencyStatKind = "won" | "lost";

export interface MatchStat {
  kind: MatchStatKind;
  label: string;
  value: number;
}

export interface CurrencyStat {
  kind: CurrencyStatKind;
  label: string;
  amount: number;
  /** Token ticker displayed after the amount, e.g. "$wUSDC" */
  currency: string;
}

export interface PredictionsOverallStatsData {
  matchStats: [MatchStat, MatchStat, MatchStat];
  currencyStats: [CurrencyStat, CurrencyStat];
}
