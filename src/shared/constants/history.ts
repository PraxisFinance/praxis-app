import type { HistoryEvent, HistoryEventType, HistoryTimeFilter } from "@/shared/types/history";

/** Human-readable labels for each history event type (UI + future type filters). */
export const HISTORY_EVENT_TYPE_LABELS: Record<HistoryEventType, string> = {
  DEPOSIT: "Deposited",
  EARN: "Earn",
  WITHDRAW: "Withdraw",
  PREDICTION: "Prediction",
  PREDICTION_WINNING_CLAIM: "Prediction winning claim",
};

/** Ordered list of event type ids for filters, analytics, etc. */
export const HISTORY_EVENT_TYPES: HistoryEventType[] = [
  "DEPOSIT",
  "EARN",
  "WITHDRAW",
  "PREDICTION",
  "PREDICTION_WINNING_CLAIM",
];

/** Time range dropdown — same wording as other charts; kept separate from `BALANCES_CHART_INTERVALS`. */
export const HISTORY_TIME_FILTER_OPTIONS: { id: HistoryTimeFilter; label: string }[] = [
  { id: "1D", label: "1 day" },
  { id: "3D", label: "3 days" },
  { id: "7D", label: "7 days" },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year" },
];

/** Anchor for mock rows and SSR clock alignment (Apr 4, 2026). */
export const HISTORY_PAGE_CLOCK_ANCHOR_MS = Date.UTC(2026, 3, 4, 15, 0, 0);

const MOCK_ANCHOR_MS = HISTORY_PAGE_CLOCK_ANCHOR_MS;

export const HISTORY_EVENTS_MOCK: HistoryEvent[] = [
  {
    id: "h1",
    timestamp: MOCK_ANCHOR_MS - 60 * 60 * 1000,
    type: "WITHDRAW",
    amount: -500,
    amountCurrency: "wallet",
  },
  {
    id: "h2",
    timestamp: MOCK_ANCHOR_MS - 2 * 60 * 60 * 1000,
    type: "PREDICTION",
    amount: 25,
    amountCurrency: "ytToken",
  },
  {
    id: "h3",
    timestamp: MOCK_ANCHOR_MS - 5 * 60 * 60 * 1000,
    type: "EARN",
    amount: 100,
    amountCurrency: "ytToken",
  },
  {
    id: "h4",
    timestamp: MOCK_ANCHOR_MS - 26 * 60 * 60 * 1000,
    type: "PREDICTION",
    amount: -50,
    amountCurrency: "deposit",
  },
  {
    id: "h5",
    timestamp: MOCK_ANCHOR_MS - 30 * 60 * 60 * 1000,
    type: "DEPOSIT",
    amount: 200,
    amountCurrency: "wallet",
  },
  {
    id: "h6",
    timestamp: MOCK_ANCHOR_MS - 50 * 60 * 60 * 1000,
    type: "PREDICTION_WINNING_CLAIM",
    amount: 120,
    amountCurrency: "deposit",
  },
];

export function historyTimeFilterCutoffMs(interval: HistoryTimeFilter, nowMs: number): number {
  const day = 24 * 60 * 60 * 1000;
  switch (interval) {
    case "1D":
      return nowMs - day;
    case "3D":
      return nowMs - 3 * day;
    case "7D":
      return nowMs - 7 * day;
    case "1M":
      return nowMs - 30 * day;
    case "1Y":
      return nowMs - 365 * day;
  }
}
