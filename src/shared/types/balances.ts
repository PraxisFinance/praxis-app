export interface Balance {
  label: string;
  value: string;
  iconUrl: string;
}

export interface BalanceInfo {
  label: string;
  description: string;
  iconUrl: string;
}

// ── Chart ──────────────────────────────────────────────────────────────────

export type BalancesChartInterval = "1D" | "3D" | "7D" | "1M" | "1Y";

/** Keys matching the three currencies in DEFAULT_BALANCES. */
export type BalanceCurrencyKey = "wallet" | "deposit" | "ytToken";

export interface BalancesChartDataPoint {
  date: string;
  wallet: number;
  deposit: number;
  ytToken: number;
}

export interface BalanceCurrencyMeta {
  key: BalanceCurrencyKey;
  label: string;
  color: string;
  iconUrl: string;
}
