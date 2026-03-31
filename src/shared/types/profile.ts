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

// ── Predictions stats chart ────────────────────────────────────────────────

export type PredictionsStatsInterval = "1D" | "3D" | "7D" | "1M" | "1Y";
export type PredictionsStatsLineKey = "count" | "win" | "lost";

export interface PredictionsStatsDataPoint {
  date: string;
  count: number;
  win: number;
  lost: number;
}

export interface PredictionsStatsLineMeta {
  key: PredictionsStatsLineKey;
  label: string;
  color: string;
}

// ── Predictions history ────────────────────────────────────────────────────

export type PredictionsHistoryInterval = "1D" | "3D" | "7D" | "1M" | "1Y";
export type PredictionHistoryResult = "won" | "lost";

export interface PredictionHistoryItem {
  id: string;
  result: PredictionHistoryResult;
  /** Display name of the prediction / match */
  prediction: string;
  /** Formatted date string, e.g. "12/03/26" */
  date: string;
  amount: number;
  currency: string;
}
