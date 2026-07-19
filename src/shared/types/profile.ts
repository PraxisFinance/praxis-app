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
  /** Token ticker displayed after the amount, e.g. "$YT" */
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
export type PredictionHistoryResult = "won" | "lost" | "pending";

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

// ── Profile predictions ────────────────────────────────────────────────────

export type ProfilePredictionStatusFilter = "all" | "complete" | "in_progress";
export type ProfilePredictionTimeInterval = "1D" | "3D" | "7D" | "1M" | "1Y";
export type ProfilePredictionKind = "pool" | "match";

interface ProfilePredictionBase {
  id: string;
  kind: ProfilePredictionKind;
  name: string;
  iconUrl: string;
  ended: boolean;
  userWon: boolean;
}

export interface ProfilePoolPrediction extends ProfilePredictionBase {
  kind: "pool";
  tvl: string;
  earnings: string;
  usersWon: number;
  progressPercent: number;
}

export interface ProfileMatchPrediction extends ProfilePredictionBase {
  kind: "match";
  coeff: number;
  prediction: string;
  earnings: string;
}

export type ProfilePredictionItem = ProfilePoolPrediction | ProfileMatchPrediction;

// ── Settings ───────────────────────────────────────────────────────────────

export interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
// ── Rewards claims ─────────────────────────────────────────────────────────

export interface RewardClaimItem {
  id: string;
  /** Pool or market name shown in the row */
  name: string;
  iconUrl: string;
  income: number;
  /** Token ticker for income amount, e.g. "ytPraxis" */
  incomeCurrency: string;
}
