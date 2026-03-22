import { create } from "zustand";

export interface TokenBalance {
  symbol: string;
  name: string;
  address: `0x${string}`;
  balance: bigint;
  decimals: number;
  usdValue: number;
}

export interface Deposit {
  amount: bigint;
  depositedAt: number;
  maturityDate: number;
  apy: number;
  status: "active" | "matured" | "withdrawn";
}

export interface YTToken {
  symbol: string;
  name: string;
  address: `0x${string}`;
  balance: bigint;
  decimals: number;
  underlyingAsset: string;
  maturityDate: number;
  currentYield: number;
}

interface AccountState {
  address: `0x${string}` | null;
  tokenBalances: TokenBalance[];
  deposit: Deposit | null;
  ytTokens: YTToken[];

  setAddress: (address: `0x${string}` | null) => void;
  setTokenBalances: (balances: TokenBalance[]) => void;
  setDeposit: (deposit: Deposit | null) => void;
  setYTTokens: (tokens: YTToken[]) => void;
  reset: () => void;
}

const MOCK_TOKEN_BALANCES: TokenBalance[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    balance: BigInt("1500000000000000000"), // 1.5 ETH
    decimals: 18,
    usdValue: 3750.0,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    balance: BigInt("5000000000"), // 5000 USDC
    decimals: 6,
    usdValue: 5000.0,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    balance: BigInt("10000000"), // 0.1 WBTC
    decimals: 8,
    usdValue: 6500.0,
  },
];

const MOCK_DEPOSIT: Deposit = {
  amount: BigInt("2000000000"), // 2000 USDC
  depositedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  maturityDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
  apy: 8.5,
  status: "active",
};

const MOCK_YT_TOKENS: YTToken[] = [
  {
    symbol: "YT-stETH",
    name: "Yield Token stETH",
    address: "0x1234567890123456789012345678901234567890",
    balance: BigInt("500000000000000000"), // 0.5 YT-stETH
    decimals: 18,
    underlyingAsset: "stETH",
    maturityDate: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days from now
    currentYield: 4.2,
  },
  {
    symbol: "YT-rETH",
    name: "Yield Token rETH",
    address: "0x2345678901234567890123456789012345678901",
    balance: BigInt("250000000000000000"), // 0.25 YT-rETH
    decimals: 18,
    underlyingAsset: "rETH",
    maturityDate: Date.now() + 120 * 24 * 60 * 60 * 1000, // 120 days from now
    currentYield: 3.8,
  },
];

const initialState = {
  address: null,
  tokenBalances: [],
  deposit: null,
  ytTokens: [],
};

export const useAccountStore = create<AccountState>((set) => ({
  ...initialState,

  setAddress: (address) => set({ address }),

  setTokenBalances: (tokenBalances) => set({ tokenBalances }),

  setDeposit: (deposit) => set({ deposit }),

  setYTTokens: (ytTokens) => set({ ytTokens }),

  reset: () => set(initialState),
}));

export const loadMockData = () => {
  const store = useAccountStore.getState();
  store.setAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f8dB21");
  store.setTokenBalances(MOCK_TOKEN_BALANCES);
  store.setDeposit(MOCK_DEPOSIT);
  store.setYTTokens(MOCK_YT_TOKENS);
};

export const formatTokenBalance = (balance: bigint, decimals: number): string => {
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;

  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
  const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, "");

  if (trimmedFractional) {
    return `${integerPart}.${trimmedFractional}`;
  }
  return integerPart.toString();
};
