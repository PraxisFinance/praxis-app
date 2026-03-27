import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";

// ── Lottery registry ─────────────────────────────────────────────────
// Each entry maps a human-readable key to its on-chain/indexer entity ID.
// Add new lotteries here and they'll automatically be available.

export interface LotteryConfig {
  key: string;
  label: string;
  entityId: string;
}

const LOTTERY_REGISTRY: LotteryConfig[] = [
  { key: "yt-lottery", label: "YT Lottery", entityId: "PraxisYTLottery" },
];

export function getLotteryRegistry(): LotteryConfig[] {
  return LOTTERY_REGISTRY;
}

// ── Envio-derived types ──────────────────────────────────────────────

export type LotteryStatus = "Open" | "DrawRequested" | "Finished";

export interface LotteryState {
  id: string;
  state: LotteryStatus;
  totalDeposits: bigint;
  participantCount: number;
  numWinners: number;
  minDeposit: bigint;
  prizePerWinner: bigint;
  vrfRequestId: bigint;
  drawRequestedAt: bigint;
  finishedAt: bigint;
  totalClaimed: bigint;
  claimsRemaining: number;
  lastUpdatedAt: bigint;
}

export interface LotteryParticipant {
  id: string;
  address: string;
  depositAmount: bigint;
  depositCount: number;
  withdrawCount: number;
  firstDepositAt: bigint;
  lastActivityAt: bigint;
  isWinner: boolean;
  hasClaimed: boolean;
  prizeAmount: bigint;
  winProbabilityBps: number;
}

export interface LotteryWinner {
  id: string;
  address: string;
  rank: number;
  prizeAmount: bigint;
  depositedAmount: bigint;
  winProbabilityBps: number;
  claimedAt: bigint;
}

export interface LotteryDailySnapshot {
  id: string;
  date: string;
  timestamp: bigint;
  totalDeposits: bigint;
  participantCount: number;
  dailyDeposits: bigint;
  dailyWithdrawals: bigint;
  netFlow: bigint;
}

export interface LotteryDepositEvent {
  id: string;
  user: string;
  amount: bigint;
}

export interface LotteryWithdrawEvent {
  id: string;
  user: string;
  amount: bigint;
}

export interface LotteryDrawRequestedEvent {
  id: string;
  requestId: bigint;
}

export interface LotteryWinnersSelectedEvent {
  id: string;
  winners: string[];
  prizePerWinner: bigint;
}

export interface LotteryPrizeClaimedEvent {
  id: string;
  winner: string;
  amount: bigint;
}

// ── Per-lottery data bundle ──────────────────────────────────────────

export interface LotteryData {
  config: LotteryConfig;
  state: LotteryState | null;
  participants: LotteryParticipant[];
  winners: LotteryWinner[];
  dailySnapshots: LotteryDailySnapshot[];
  userParticipation: LotteryParticipant | null;
}

function emptyLotteryData(config: LotteryConfig): LotteryData {
  return {
    config,
    state: null,
    participants: [],
    winners: [],
    dailySnapshots: [],
    userParticipation: null,
  };
}

// ── Store ────────────────────────────────────────────────────────────

interface LotteryStoreState {
  lotteries: Record<string, LotteryData>;
  activeLotteryKey: string;
  loading: boolean;
  error: string | null;

  setActiveLottery: (key: string) => void;
  getActiveLottery: () => LotteryData | undefined;
  getLottery: (key: string) => LotteryData | undefined;

  fetchLotteryState: (key: string) => Promise<void>;
  fetchParticipants: (key: string, limit?: number) => Promise<void>;
  fetchWinners: (key: string) => Promise<void>;
  fetchDailySnapshots: (key: string, limit?: number) => Promise<void>;
  fetchUserParticipation: (key: string, address: string) => Promise<void>;
  fetchAllForLottery: (key: string, userAddress?: string) => Promise<void>;
  fetchAll: (userAddress?: string) => Promise<void>;

  reset: () => void;
}

function buildInitialLotteries(): Record<string, LotteryData> {
  const map: Record<string, LotteryData> = {};
  for (const config of LOTTERY_REGISTRY) {
    map[config.key] = emptyLotteryData(config);
  }
  return map;
}

const initialState = {
  lotteries: buildInitialLotteries(),
  activeLotteryKey: LOTTERY_REGISTRY[0]?.key ?? "",
  loading: false,
  error: null as string | null,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const LOTTERY_STATE_QUERY = `
  query LotteryState {
    LotteryState(limit: 1) {
      id
      state
      totalDeposits
      participantCount
      numWinners
      minDeposit
      prizePerWinner
      vrfRequestId
      drawRequestedAt
      finishedAt
      totalClaimed
      claimsRemaining
      lastUpdatedAt
    }
  }
`;

const LOTTERY_PARTICIPANTS_QUERY = `
  query LotteryParticipants($limit: Int!) {
    LotteryParticipant(order_by: { depositAmount: desc }, limit: $limit) {
      id
      address
      depositAmount
      depositCount
      withdrawCount
      firstDepositAt
      lastActivityAt
      isWinner
      hasClaimed
      prizeAmount
      winProbabilityBps
    }
  }
`;

const LOTTERY_WINNERS_QUERY = `
  query LotteryWinners {
    LotteryWinner(order_by: { rank: asc }) {
      id
      address
      rank
      prizeAmount
      depositedAmount
      winProbabilityBps
      claimedAt
    }
  }
`;

const LOTTERY_DAILY_SNAPSHOTS_QUERY = `
  query LotteryDailySnapshots($limit: Int!) {
    LotteryDailySnapshot(order_by: { timestamp: desc }, limit: $limit) {
      id
      date
      timestamp
      totalDeposits
      participantCount
      dailyDeposits
      dailyWithdrawals
      netFlow
    }
  }
`;

const LOTTERY_USER_PARTICIPATION_QUERY = `
  query LotteryUserParticipation($address: String!) {
    LotteryParticipant(where: { address: { _eq: $address } }, limit: 1) {
      id
      address
      depositAmount
      depositCount
      withdrawCount
      firstDepositAt
      lastActivityAt
      isWinner
      hasClaimed
      prizeAmount
      winProbabilityBps
    }
  }
`;

// ── Raw → typed mappers ──────────────────────────────────────────────

interface RawLotteryState {
  id: string;
  state: string;
  totalDeposits: string;
  participantCount: number;
  numWinners: number;
  minDeposit: string;
  prizePerWinner: string;
  vrfRequestId: string;
  drawRequestedAt: string;
  finishedAt: string;
  totalClaimed: string;
  claimsRemaining: number;
  lastUpdatedAt: string;
}

function mapLotteryState(raw: RawLotteryState): LotteryState {
  return {
    id: raw.id,
    state: raw.state as LotteryStatus,
    totalDeposits: toBigInt(raw.totalDeposits),
    participantCount: raw.participantCount,
    numWinners: raw.numWinners,
    minDeposit: toBigInt(raw.minDeposit),
    prizePerWinner: toBigInt(raw.prizePerWinner),
    vrfRequestId: toBigInt(raw.vrfRequestId),
    drawRequestedAt: toBigInt(raw.drawRequestedAt),
    finishedAt: toBigInt(raw.finishedAt),
    totalClaimed: toBigInt(raw.totalClaimed),
    claimsRemaining: raw.claimsRemaining,
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
  };
}

interface RawLotteryParticipant {
  id: string;
  address: string;
  depositAmount: string;
  depositCount: number;
  withdrawCount: number;
  firstDepositAt: string;
  lastActivityAt: string;
  isWinner: boolean;
  hasClaimed: boolean;
  prizeAmount: string;
  winProbabilityBps: number;
}

function mapParticipant(raw: RawLotteryParticipant): LotteryParticipant {
  return {
    id: raw.id,
    address: raw.address,
    depositAmount: toBigInt(raw.depositAmount),
    depositCount: raw.depositCount,
    withdrawCount: raw.withdrawCount,
    firstDepositAt: toBigInt(raw.firstDepositAt),
    lastActivityAt: toBigInt(raw.lastActivityAt),
    isWinner: raw.isWinner,
    hasClaimed: raw.hasClaimed,
    prizeAmount: toBigInt(raw.prizeAmount),
    winProbabilityBps: raw.winProbabilityBps,
  };
}

interface RawLotteryWinner {
  id: string;
  address: string;
  rank: number;
  prizeAmount: string;
  depositedAmount: string;
  winProbabilityBps: number;
  claimedAt: string;
}

function mapWinner(raw: RawLotteryWinner): LotteryWinner {
  return {
    id: raw.id,
    address: raw.address,
    rank: raw.rank,
    prizeAmount: toBigInt(raw.prizeAmount),
    depositedAmount: toBigInt(raw.depositedAmount),
    winProbabilityBps: raw.winProbabilityBps,
    claimedAt: toBigInt(raw.claimedAt),
  };
}

interface RawLotterySnapshot {
  id: string;
  date: string;
  timestamp: string;
  totalDeposits: string;
  participantCount: number;
  dailyDeposits: string;
  dailyWithdrawals: string;
  netFlow: string;
}

function mapLotterySnapshot(raw: RawLotterySnapshot): LotteryDailySnapshot {
  return {
    id: raw.id,
    date: raw.date,
    timestamp: toBigInt(raw.timestamp),
    totalDeposits: toBigInt(raw.totalDeposits),
    participantCount: raw.participantCount,
    dailyDeposits: toBigInt(raw.dailyDeposits),
    dailyWithdrawals: toBigInt(raw.dailyWithdrawals),
    netFlow: toBigInt(raw.netFlow),
  };
}

// ── Helper to patch a single lottery entry ───────────────────────────

function patchLottery(
  lotteries: Record<string, LotteryData>,
  key: string,
  patch: Partial<LotteryData>
): Record<string, LotteryData> {
  const existing = lotteries[key];
  if (!existing) return lotteries;
  return { ...lotteries, [key]: { ...existing, ...patch } };
}

// ── Zustand store ────────────────────────────────────────────────────

export const useLotteryStore = create<LotteryStoreState>((set, get) => ({
  ...initialState,

  setActiveLottery: (key) => set({ activeLotteryKey: key }),

  getActiveLottery: () => {
    const { lotteries, activeLotteryKey } = get();
    return lotteries[activeLotteryKey];
  },

  getLottery: (key) => get().lotteries[key],

  fetchLotteryState: async (key) => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ LotteryState: RawLotteryState[] }>(LOTTERY_STATE_QUERY);
      const raw = data.LotteryState[0];
      set((s) => ({
        lotteries: patchLottery(s.lotteries, key, {
          state: raw ? mapLotteryState(raw) : null,
        }),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchParticipants: async (key, limit = 100) => {
    try {
      const data = await envioQuery<{ LotteryParticipant: RawLotteryParticipant[] }>(
        LOTTERY_PARTICIPANTS_QUERY,
        { limit }
      );
      set((s) => ({
        lotteries: patchLottery(s.lotteries, key, {
          participants: data.LotteryParticipant.map(mapParticipant),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchWinners: async (key) => {
    try {
      const data = await envioQuery<{ LotteryWinner: RawLotteryWinner[] }>(LOTTERY_WINNERS_QUERY);
      set((s) => ({
        lotteries: patchLottery(s.lotteries, key, {
          winners: data.LotteryWinner.map(mapWinner),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchDailySnapshots: async (key, limit = 30) => {
    try {
      const data = await envioQuery<{ LotteryDailySnapshot: RawLotterySnapshot[] }>(
        LOTTERY_DAILY_SNAPSHOTS_QUERY,
        { limit }
      );
      set((s) => ({
        lotteries: patchLottery(s.lotteries, key, {
          dailySnapshots: data.LotteryDailySnapshot.map(mapLotterySnapshot),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserParticipation: async (key, address) => {
    try {
      const data = await envioQuery<{ LotteryParticipant: RawLotteryParticipant[] }>(
        LOTTERY_USER_PARTICIPATION_QUERY,
        { address }
      );
      const raw = data.LotteryParticipant[0];
      set((s) => ({
        lotteries: patchLottery(s.lotteries, key, {
          userParticipation: raw ? mapParticipant(raw) : null,
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchAllForLottery: async (key, userAddress) => {
    set({ loading: true, error: null });
    try {
      const promises: Promise<void>[] = [
        get().fetchLotteryState(key),
        get().fetchParticipants(key),
        get().fetchWinners(key),
        get().fetchDailySnapshots(key),
      ];
      if (userAddress) {
        promises.push(get().fetchUserParticipation(key, userAddress));
      }
      await Promise.all(promises);
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      await Promise.all(
        LOTTERY_REGISTRY.map((cfg) => get().fetchAllForLottery(cfg.key, userAddress))
      );
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  reset: () => set({ ...initialState, lotteries: buildInitialLotteries() }),
}));

// ── Formatting helpers ───────────────────────────────────────────────

export const formatLotteryAmount = (amount: bigint, decimals = 6): string => {
  const value = Number(amount) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatWinProbability = (bps: number): string => {
  return `${(bps / 100).toFixed(2)}%`;
};

export const formatLotteryStatus = (status: LotteryStatus): string => {
  const labels: Record<LotteryStatus, string> = {
    Open: "Open",
    DrawRequested: "Drawing…",
    Finished: "Finished",
  };
  return labels[status];
};

export const shortenAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};
