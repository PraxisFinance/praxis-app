import type { PredictionsOverallStatsData } from "@/shared/types/profile";

export const PREDICTIONS_OVERALL_STATS_MOCK: PredictionsOverallStatsData = {
  matchStats: [
    { kind: "won",     label: "Won matches",     value: 101 },
    { kind: "lost",    label: "Lose matches",    value: 54  },
    { kind: "pending", label: "Pending matches", value: 15  },
  ],
  currencyStats: [
    { kind: "won",  label: "Won currency",  amount: 1000, currency: "$wUSDC" },
    { kind: "lost", label: "Lost currency", amount: 500,  currency: "$wUSDC" },
  ],
};
