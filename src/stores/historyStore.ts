import { create } from "zustand";

export interface HistoryItem {
  id: string;
  time: number;
  text: string;
  amount: bigint;
}

interface HistoryState {
  history: HistoryItem[];

  setHistory: (history: HistoryItem[]) => void;
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  reset: () => void;
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    time: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    text: "Deposited to Yield Vault - 30 Day",
    amount: BigInt("25000000000"), // 25,000 USDC
  },
  {
    id: "hist-2",
    time: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    text: "Claimed winnings from Man United vs Liverpool",
    amount: BigInt("150000000"), // 150 USDC
  },
  {
    id: "hist-3",
    time: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    text: "Placed bet on BTC Price End of Month",
    amount: BigInt("-500000000"), // -500 USDC
  },
  {
    id: "hist-4",
    time: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    text: "Withdrew from Yield Vault - 14 Day",
    amount: BigInt("10500000000"), // 10,500 USDC
  },
  {
    id: "hist-5",
    time: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    text: "Entered Weekly RYD #42",
    amount: BigInt("-100000000"), // -100 USDC
  },
  {
    id: "hist-6",
    time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    text: "Deposited to Stable Vault - 60 Day",
    amount: BigInt("10000000000"), // 10,000 USDC
  },
];

const initialState = {
  history: [] as HistoryItem[],
};

export const useHistoryStore = create<HistoryState>((set) => ({
  ...initialState,

  setHistory: (history) => set({ history }),

  addHistoryItem: (item) =>
    set((state) => ({
      history: [item, ...state.history],
    })),

  clearHistory: () => set({ history: [] }),

  reset: () => set(initialState),
}));

export const loadMockHistory = () => {
  useHistoryStore.getState().setHistory(MOCK_HISTORY);
};

export const formatHistoryTime = (time: number): string => {
  const diff = Date.now() - time;
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatHistoryAmount = (amount: bigint, decimals: number = 6): string => {
  const value = Number(amount) / 10 ** decimals;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};
