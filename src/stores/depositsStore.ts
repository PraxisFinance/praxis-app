import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";

// ── Envio-derived types ──────────────────────────────────────────────

export interface VaultState {
  id: string;
  totalDeposited: bigint;
  totalWithdrawn: bigint;
  totalBalance: bigint;
  totalBuyInCost: bigint;
  totalYieldPaid: bigint;
  uniqueDepositors: number;
  isPaused: boolean;
  owner: string;
  lastUpdatedAt: bigint;
}

export interface UserPosition {
  id: string;
  address: string;
  totalDeposited: bigint;
  totalWithdrawn: bigint;
  currentBalance: bigint;
  totalBuyInCost: bigint;
  totalYieldClaimed: bigint;
  depositCount: number;
  firstDepositAt: bigint;
  lastActivityAt: bigint;
}

export interface VaultDailySnapshot {
  id: string;
  date: string;
  timestamp: bigint;
  totalBalance: bigint;
  totalDeposited: bigint;
  totalWithdrawn: bigint;
  totalYieldPaid: bigint;
  uniqueDepositors: number;
  dailyDeposits: bigint;
  dailyWithdrawals: bigint;
  dailyYield: bigint;
}

export interface DepositEvent {
  id: string;
  principal: bigint;
  buyIn: bigint;
  receiver: string;
}

export interface WithdrawEvent {
  id: string;
  amount: bigint;
  yieldPayout: bigint;
  receiver: string;
}

export interface RedeemYieldEvent {
  id: string;
  ytBurn: bigint;
  payout: bigint;
  receiver: string;
}

// ── Store ────────────────────────────────────────────────────────────

interface DepositsState {
  vault: VaultState | null;
  userPosition: UserPosition | null;
  dailySnapshots: VaultDailySnapshot[];
  deposits: DepositEvent[];
  withdrawals: WithdrawEvent[];
  redeems: RedeemYieldEvent[];
  loading: boolean;
  error: string | null;

  fetchVaultState: () => Promise<void>;
  fetchUserPosition: (address: string) => Promise<void>;
  fetchDailySnapshots: (limit?: number) => Promise<void>;
  fetchUserDeposits: (address: string) => Promise<void>;
  fetchUserWithdrawals: (address: string) => Promise<void>;
  fetchUserRedeems: (address: string) => Promise<void>;
  fetchAll: (userAddress?: string) => Promise<void>;

  getTotalUserDeposits: () => bigint;
  getUserNetBalance: () => bigint;

  reset: () => void;
}

const initialState = {
  vault: null as VaultState | null,
  userPosition: null as UserPosition | null,
  dailySnapshots: [] as VaultDailySnapshot[],
  deposits: [] as DepositEvent[],
  withdrawals: [] as WithdrawEvent[],
  redeems: [] as RedeemYieldEvent[],
  loading: false,
  error: null as string | null,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const VAULT_STATE_QUERY = `
  query VaultState {
    VaultState(limit: 1) {
      id
      totalDeposited
      totalWithdrawn
      totalBalance
      totalBuyInCost
      totalYieldPaid
      uniqueDepositors
      isPaused
      owner
      lastUpdatedAt
    }
  }
`;

const USER_POSITION_QUERY = `
  query UserPosition($address: String!) {
    UserPosition(where: { address: { _eq: $address } }, limit: 1) {
      id
      address
      totalDeposited
      totalWithdrawn
      currentBalance
      totalBuyInCost
      totalYieldClaimed
      depositCount
      firstDepositAt
      lastActivityAt
    }
  }
`;

const DAILY_SNAPSHOTS_QUERY = `
  query VaultDailySnapshots($limit: Int!) {
    VaultDailySnapshot(order_by: { timestamp: desc }, limit: $limit) {
      id
      date
      timestamp
      totalBalance
      totalDeposited
      totalWithdrawn
      totalYieldPaid
      uniqueDepositors
      dailyDeposits
      dailyWithdrawals
      dailyYield
    }
  }
`;

const USER_DEPOSITS_QUERY = `
  query UserDeposits($receiver: String!) {
    PraxisVault_Deposit(where: { receiver: { _eq: $receiver } }) {
      id
      principal
      buyIn
      receiver
    }
  }
`;

const USER_WITHDRAWALS_QUERY = `
  query UserWithdrawals($receiver: String!) {
    PraxisVault_Withdraw(where: { receiver: { _eq: $receiver } }) {
      id
      amount
      yieldPayout
      receiver
    }
  }
`;

const USER_REDEEMS_QUERY = `
  query UserRedeems($receiver: String!) {
    PraxisVault_RedeemYield(where: { receiver: { _eq: $receiver } }) {
      id
      ytBurn
      payout
      receiver
    }
  }
`;

// ── Raw → typed mappers ──────────────────────────────────────────────

interface RawVaultState {
  id: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalBalance: string;
  totalBuyInCost: string;
  totalYieldPaid: string;
  uniqueDepositors: number;
  isPaused: boolean;
  owner: string;
  lastUpdatedAt: string;
}

function mapVaultState(raw: RawVaultState): VaultState {
  return {
    id: raw.id,
    totalDeposited: toBigInt(raw.totalDeposited),
    totalWithdrawn: toBigInt(raw.totalWithdrawn),
    totalBalance: toBigInt(raw.totalBalance),
    totalBuyInCost: toBigInt(raw.totalBuyInCost),
    totalYieldPaid: toBigInt(raw.totalYieldPaid),
    uniqueDepositors: raw.uniqueDepositors,
    isPaused: raw.isPaused,
    owner: raw.owner,
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
  };
}

interface RawUserPosition {
  id: string;
  address: string;
  totalDeposited: string;
  totalWithdrawn: string;
  currentBalance: string;
  totalBuyInCost: string;
  totalYieldClaimed: string;
  depositCount: number;
  firstDepositAt: string;
  lastActivityAt: string;
}

function mapUserPosition(raw: RawUserPosition): UserPosition {
  return {
    id: raw.id,
    address: raw.address,
    totalDeposited: toBigInt(raw.totalDeposited),
    totalWithdrawn: toBigInt(raw.totalWithdrawn),
    currentBalance: toBigInt(raw.currentBalance),
    totalBuyInCost: toBigInt(raw.totalBuyInCost),
    totalYieldClaimed: toBigInt(raw.totalYieldClaimed),
    depositCount: raw.depositCount,
    firstDepositAt: toBigInt(raw.firstDepositAt),
    lastActivityAt: toBigInt(raw.lastActivityAt),
  };
}

interface RawSnapshot {
  id: string;
  date: string;
  timestamp: string;
  totalBalance: string;
  totalDeposited: string;
  totalWithdrawn: string;
  totalYieldPaid: string;
  uniqueDepositors: number;
  dailyDeposits: string;
  dailyWithdrawals: string;
  dailyYield: string;
}

function mapSnapshot(raw: RawSnapshot): VaultDailySnapshot {
  return {
    id: raw.id,
    date: raw.date,
    timestamp: toBigInt(raw.timestamp),
    totalBalance: toBigInt(raw.totalBalance),
    totalDeposited: toBigInt(raw.totalDeposited),
    totalWithdrawn: toBigInt(raw.totalWithdrawn),
    totalYieldPaid: toBigInt(raw.totalYieldPaid),
    uniqueDepositors: raw.uniqueDepositors,
    dailyDeposits: toBigInt(raw.dailyDeposits),
    dailyWithdrawals: toBigInt(raw.dailyWithdrawals),
    dailyYield: toBigInt(raw.dailyYield),
  };
}

interface RawDeposit {
  id: string;
  principal: string;
  buyIn: string;
  receiver: string;
}

function mapDeposit(raw: RawDeposit): DepositEvent {
  return {
    id: raw.id,
    principal: toBigInt(raw.principal),
    buyIn: toBigInt(raw.buyIn),
    receiver: raw.receiver,
  };
}

interface RawWithdraw {
  id: string;
  amount: string;
  yieldPayout: string;
  receiver: string;
}

function mapWithdraw(raw: RawWithdraw): WithdrawEvent {
  return {
    id: raw.id,
    amount: toBigInt(raw.amount),
    yieldPayout: toBigInt(raw.yieldPayout),
    receiver: raw.receiver,
  };
}

interface RawRedeem {
  id: string;
  ytBurn: string;
  payout: string;
  receiver: string;
}

function mapRedeem(raw: RawRedeem): RedeemYieldEvent {
  return {
    id: raw.id,
    ytBurn: toBigInt(raw.ytBurn),
    payout: toBigInt(raw.payout),
    receiver: raw.receiver,
  };
}

// ── Zustand store ────────────────────────────────────────────────────

const USDC_DECIMALS = 6;

export const useDepositsStore = create<DepositsState>((set, get) => ({
  ...initialState,

  fetchVaultState: async () => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ VaultState: RawVaultState[] }>(VAULT_STATE_QUERY);
      const raw = data.VaultState[0];
      set({ vault: raw ? mapVaultState(raw) : null, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchUserPosition: async (address) => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ UserPosition: RawUserPosition[] }>(USER_POSITION_QUERY, {
        address,
      });
      const raw = data.UserPosition[0];
      set({ userPosition: raw ? mapUserPosition(raw) : null, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchDailySnapshots: async (limit = 30) => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ VaultDailySnapshot: RawSnapshot[] }>(
        DAILY_SNAPSHOTS_QUERY,
        { limit }
      );
      set({ dailySnapshots: data.VaultDailySnapshot.map(mapSnapshot), loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchUserDeposits: async (address) => {
    try {
      const data = await envioQuery<{ PraxisVault_Deposit: RawDeposit[] }>(USER_DEPOSITS_QUERY, {
        receiver: address,
      });
      set({ deposits: data.PraxisVault_Deposit.map(mapDeposit) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserWithdrawals: async (address) => {
    try {
      const data = await envioQuery<{ PraxisVault_Withdraw: RawWithdraw[] }>(
        USER_WITHDRAWALS_QUERY,
        { receiver: address }
      );
      set({ withdrawals: data.PraxisVault_Withdraw.map(mapWithdraw) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserRedeems: async (address) => {
    try {
      const data = await envioQuery<{ PraxisVault_RedeemYield: RawRedeem[] }>(
        USER_REDEEMS_QUERY,
        { receiver: address }
      );
      set({ redeems: data.PraxisVault_RedeemYield.map(mapRedeem) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      const promises: Promise<void>[] = [
        get().fetchVaultState(),
        get().fetchDailySnapshots(),
      ];
      if (userAddress) {
        promises.push(
          get().fetchUserPosition(userAddress),
          get().fetchUserDeposits(userAddress),
          get().fetchUserWithdrawals(userAddress),
          get().fetchUserRedeems(userAddress)
        );
      }
      await Promise.all(promises);
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  getTotalUserDeposits: () => {
    return get().userPosition?.totalDeposited ?? BigInt(0);
  },

  getUserNetBalance: () => {
    return get().userPosition?.currentBalance ?? BigInt(0);
  },

  reset: () => set(initialState),
}));

// ── Formatting helpers ───────────────────────────────────────────────

export const formatUSDC = (amount: bigint): string => {
  const value = Number(amount) / 10 ** USDC_DECIMALS;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatTimestamp = (ts: bigint): string => {
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getTimeSince = (ts: bigint): string => {
  const diff = Date.now() - Number(ts) * 1000;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days > 0) return `${days} days`;

  const hours = Math.floor(diff / (60 * 60 * 1000));
  return `${hours} hours`;
};
