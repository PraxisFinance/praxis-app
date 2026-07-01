import { create } from "zustand";

export interface BalanceChartPoint {
  date: number;
  balance: bigint;
}

export interface PredictionHistoryItem {
  id: string;
  date: number;
  /** Human-readable market/event label (from ActivityItem.title). */
  label: string;
  status: "won" | "lost" | "pending";
  amount: bigint;
  /** Discriminates between CPF match bets and RYD pool entries. Defaults to "cpf". */
  kind?: "cpf" | "ryd";
  /** For RYD items only: prize amount at 6 decimals. */
  prize?: bigint;
}

interface StatisticsState {
  balanceChart: BalanceChartPoint[];
  predictionHistory: PredictionHistoryItem[];

  wonMatches: number;
  lostMatches: number;
  pendingMatches: number;
  wonCurrency: bigint;
  lostCurrency: bigint;

  /** True once the first successful history fetch has populated all fields. */
  historyLoaded: boolean;

  setBalanceChart: (data: BalanceChartPoint[]) => void;
  setPredictionHistory: (history: PredictionHistoryItem[]) => void;
  setMatchStats: (won: number, lost: number, pending: number) => void;
  setCurrencyStats: (won: bigint, lost: bigint) => void;
  setHistoryLoaded: (loaded: boolean) => void;

  getWinRate: () => number;
  getNetProfit: () => bigint;
  reset: () => void;
}

const generateMockBalanceChart = (): BalanceChartPoint[] => {
  const points: BalanceChartPoint[] = [];
  let balance = BigInt("10000000000"); // Start with 10,000 USDC

  for (let i = 30; i >= 0; i--) {
    const date = Date.now() - i * 24 * 60 * 60 * 1000;
    points.push({ date, balance });

    const change = BigInt(Math.floor((Math.random() - 0.4) * 500000000));
    balance = balance + change;
    if (balance < BigInt(0)) balance = BigInt("1000000000");
  }

  return points;
};

const MOCK_PREDICTION_HISTORY: PredictionHistoryItem[] = [
  {
    id: "pred-1",
    date: Date.now() - 1 * 24 * 60 * 60 * 1000,
    label: "Placed bet on BTC/USDC",
    status: "won",
    amount: BigInt("150000000"),
  },
  {
    id: "pred-2",
    date: Date.now() - 2 * 24 * 60 * 60 * 1000,
    label: "Placed bet on ETH/USDC",
    status: "lost",
    amount: BigInt("200000000"),
  },
  {
    id: "pred-3",
    date: Date.now() - 3 * 24 * 60 * 60 * 1000,
    label: "Placed bet on SOL/USDC",
    status: "won",
    amount: BigInt("320000000"),
  },
  {
    id: "pred-4",
    date: Date.now() - 4 * 24 * 60 * 60 * 1000,
    label: "Placed bet on BTC/USDC",
    status: "pending",
    amount: BigInt("50000000"),
  },
  {
    id: "pred-5",
    date: Date.now() - 5 * 24 * 60 * 60 * 1000,
    label: "Placed bet on ETH/USDC",
    status: "pending",
    amount: BigInt("75000000"),
  },
  {
    id: "pred-6",
    date: Date.now() - 6 * 24 * 60 * 60 * 1000,
    label: "Placed bet on SOL/USDC",
    status: "won",
    amount: BigInt("180000000"),
  },
  {
    id: "pred-7",
    date: Date.now() - 7 * 24 * 60 * 60 * 1000,
    label: "Placed bet on BTC/USDC",
    status: "lost",
    amount: BigInt("100000000"),
  },
  {
    id: "pred-8",
    date: Date.now() - 10 * 24 * 60 * 60 * 1000,
    label: "Placed bet on ETH/USDC",
    status: "lost",
    amount: BigInt("250000000"),
  },
];

const initialState = {
  balanceChart: [] as BalanceChartPoint[],
  predictionHistory: [] as PredictionHistoryItem[],
  wonMatches: 0,
  lostMatches: 0,
  pendingMatches: 0,
  wonCurrency: BigInt(0),
  lostCurrency: BigInt(0),
  historyLoaded: false,
};

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  ...initialState,

  setBalanceChart: (balanceChart) => set({ balanceChart }),

  setPredictionHistory: (predictionHistory) => set({ predictionHistory }),

  setMatchStats: (wonMatches, lostMatches, pendingMatches) =>
    set({ wonMatches, lostMatches, pendingMatches }),

  setCurrencyStats: (wonCurrency, lostCurrency) => set({ wonCurrency, lostCurrency }),

  setHistoryLoaded: (historyLoaded) => set({ historyLoaded }),

  getWinRate: () => {
    const { wonMatches, lostMatches } = get();
    const total = wonMatches + lostMatches;
    if (total === 0) return 0;
    return (wonMatches / total) * 100;
  },

  getNetProfit: () => {
    const { wonCurrency, lostCurrency } = get();
    return wonCurrency - lostCurrency;
  },

  reset: () => set(initialState),
}));

export const loadMockStatistics = () => {
  const store = useStatisticsStore.getState();
  store.setBalanceChart(generateMockBalanceChart());
  store.setPredictionHistory(MOCK_PREDICTION_HISTORY);
  store.setMatchStats(12, 8, 2);
  store.setCurrencyStats(
    BigInt("2500000000"), // 2,500 USDC won
    BigInt("1800000000") // 1,800 USDC lost
  );
};

export const formatChartDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatWinRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};
