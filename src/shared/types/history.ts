import type { BalanceCurrencyKey } from "@/shared/types/balances";

/** Action kinds shown on the global actions history screen. */
export type HistoryEventType =
  | "DEPOSIT"
  | "EARN"
  | "WITHDRAW"
  | "PREDICTION"
  | "PREDICTION_WINNING_CLAIM";

/** Time window for the history list (same spans as balance chart filters, separate constant array). */
export type HistoryTimeFilter = "1D" | "3D" | "7D" | "1M" | "1Y";

export interface HistoryEvent {
  id: string;
  /** Unix ms — used for sorting and interval filtering. */
  timestamp: number;
  type: HistoryEventType;
  /** Signed display value (e.g. -500, +100). */
  amount: number;
  /** Which balance-line icon to show in the amount pill (`BALANCE_CURRENCY_META`). */
  amountCurrency: BalanceCurrencyKey;
}
