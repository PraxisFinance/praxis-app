import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";

// ── Envio-derived types ──────────────────────────────────────────────

export type RYDStatus = "Open" | "DrawRequested" | "ReadyToResolve" | "Finished";

export interface RYDState {
  id: string;
  vault: string;
  yt: string;
  endTime: bigint;
  state: RYDStatus;
  totalDeposits: bigint;
  participantCount: number;
  numWinners: number;
  minDeposit: bigint;
  prizePerWinner: bigint;
  vrfRequestId: bigint;
  drawRequestedAt: bigint;
  randomnessReceivedAt: bigint;
  finishedAt: bigint;
  totalClaimed: bigint;
  claimsRemaining: number;
  lastUpdatedAt: bigint;
}

export interface RYDParticipant {
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

export interface RYDWinner {
  id: string;
  address: string;
  rank: number;
  prizeAmount: bigint;
  depositedAmount: bigint;
  winProbabilityBps: number;
  claimedAt: bigint;
}

export interface RYDDailySnapshot {
  id: string;
  date: string;
  timestamp: bigint;
  totalDeposits: bigint;
  participantCount: number;
  dailyDeposits: bigint;
  dailyWithdrawals: bigint;
  netFlow: bigint;
}

export interface RYDDepositEvent {
  id: string;
  user: string;
  amount: bigint;
}

export interface RYDWithdrawEvent {
  id: string;
  user: string;
  amount: bigint;
}

export interface RYDDrawRequestedEvent {
  id: string;
  requestId: bigint;
}

export interface RYDWinnersSelectedEvent {
  id: string;
  winners: string[];
  prizePerWinner: bigint;
}

export interface RYDRandomnessReceivedEvent {
  id: string;
  requestId: bigint;
}

export interface RYDPrizeClaimedEvent {
  id: string;
  winner: string;
  amount: bigint;
}

// ── Per-RYD data bundle ──────────────────────────────────────────────

export interface RYDData {
  state: RYDState | null;
  participants: RYDParticipant[];
  winners: RYDWinner[];
  dailySnapshots: RYDDailySnapshot[];
  userParticipation: RYDParticipant | null;
}

function emptyRYDData(): RYDData {
  return {
    state: null,
    participants: [],
    winners: [],
    dailySnapshots: [],
    userParticipation: null,
  };
}

// ── Store ────────────────────────────────────────────────────────────

interface RYDStoreState {
  ryds: Record<string, RYDData>;
  activeRYDId: string | null;
  loading: boolean;
  error: string | null;

  setActiveRYD: (id: string) => void;
  getActiveRYD: () => RYDData | undefined;
  getRYD: (id: string) => RYDData | undefined;

  fetchAllRYDStates: () => Promise<void>;
  fetchParticipants: (rydId: string, limit?: number) => Promise<void>;
  fetchWinners: (rydId: string) => Promise<void>;
  fetchDailySnapshots: (rydId: string, limit?: number) => Promise<void>;
  fetchUserParticipation: (rydId: string, address: string) => Promise<void>;
  fetchAllForRYD: (rydId: string, userAddress?: string) => Promise<void>;
  fetchAll: (userAddress?: string) => Promise<void>;

  reset: () => void;
}

const initialState = {
  ryds: {} as Record<string, RYDData>,
  activeRYDId: null as string | null,
  loading: false,
  error: null as string | null,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const ALL_RYD_STATES_QUERY = `
  query AllRYDStates {
    RYDState {
      id
      vault
      yt
      endTime
      state
      totalDeposits
      participantCount
      numWinners
      minDeposit
      prizePerWinner
      vrfRequestId
      drawRequestedAt
      randomnessReceivedAt
      finishedAt
      totalClaimed
      claimsRemaining
      lastUpdatedAt
    }
  }
`;

const RYD_PARTICIPANTS_QUERY = `
  query RYDParticipants($limit: Int!) {
    RYDParticipant(order_by: { depositAmount: desc }, limit: $limit) {
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

const RYD_WINNERS_QUERY = `
  query RYDWinners {
    RYDWinner(order_by: { rank: asc }) {
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

const RYD_DAILY_SNAPSHOTS_QUERY = `
  query RYDDailySnapshots($limit: Int!) {
    RYDDailySnapshot(order_by: { timestamp: desc }, limit: $limit) {
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

const RYD_USER_PARTICIPATION_QUERY = `
  query RYDUserParticipation($address: String!) {
    RYDParticipant(where: { address: { _eq: $address } }, limit: 1) {
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

interface RawRYDState {
  id: string;
  vault: string;
  yt: string;
  endTime: string;
  state: string;
  totalDeposits: string;
  participantCount: number;
  numWinners: number;
  minDeposit: string;
  prizePerWinner: string;
  vrfRequestId: string;
  drawRequestedAt: string;
  randomnessReceivedAt: string;
  finishedAt: string;
  totalClaimed: string;
  claimsRemaining: number;
  lastUpdatedAt: string;
}

function mapRYDState(raw: RawRYDState): RYDState {
  return {
    id: raw.id,
    vault: raw.vault,
    yt: raw.yt,
    endTime: toBigInt(raw.endTime),
    state: raw.state as RYDStatus,
    totalDeposits: toBigInt(raw.totalDeposits),
    participantCount: raw.participantCount,
    numWinners: raw.numWinners,
    minDeposit: toBigInt(raw.minDeposit),
    prizePerWinner: toBigInt(raw.prizePerWinner),
    vrfRequestId: toBigInt(raw.vrfRequestId),
    drawRequestedAt: toBigInt(raw.drawRequestedAt),
    randomnessReceivedAt: toBigInt(raw.randomnessReceivedAt),
    finishedAt: toBigInt(raw.finishedAt),
    totalClaimed: toBigInt(raw.totalClaimed),
    claimsRemaining: raw.claimsRemaining,
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
  };
}

interface RawRYDParticipant {
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

function mapParticipant(raw: RawRYDParticipant): RYDParticipant {
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

interface RawRYDWinner {
  id: string;
  address: string;
  rank: number;
  prizeAmount: string;
  depositedAmount: string;
  winProbabilityBps: number;
  claimedAt: string;
}

function mapWinner(raw: RawRYDWinner): RYDWinner {
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

interface RawRYDSnapshot {
  id: string;
  date: string;
  timestamp: string;
  totalDeposits: string;
  participantCount: number;
  dailyDeposits: string;
  dailyWithdrawals: string;
  netFlow: string;
}

function mapRYDSnapshot(raw: RawRYDSnapshot): RYDDailySnapshot {
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

// ── Helper to patch a single RYD entry ───────────────────────────────

function patchRYD(
  ryds: Record<string, RYDData>,
  rydId: string,
  patch: Partial<RYDData>
): Record<string, RYDData> {
  const existing = ryds[rydId] ?? emptyRYDData();
  return { ...ryds, [rydId]: { ...existing, ...patch } };
}

// ── Zustand store ────────────────────────────────────────────────────

export const useRYDStore = create<RYDStoreState>((set, get) => ({
  ...initialState,

  setActiveRYD: (id) => set({ activeRYDId: id }),

  getActiveRYD: () => {
    const { ryds, activeRYDId } = get();
    return activeRYDId ? ryds[activeRYDId] : undefined;
  },

  getRYD: (id) => get().ryds[id],

  fetchAllRYDStates: async () => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ RYDState: RawRYDState[] }>(ALL_RYD_STATES_QUERY);
      const nextRyds = { ...get().ryds };
      for (const raw of data.RYDState) {
        const mapped = mapRYDState(raw);
        const existing = nextRyds[mapped.id] ?? emptyRYDData();
        nextRyds[mapped.id] = { ...existing, state: mapped };
      }
      const activeId = get().activeRYDId;
      set({
        ryds: nextRyds,
        activeRYDId: activeId && nextRyds[activeId] ? activeId : (data.RYDState[0]?.id ?? null),
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchParticipants: async (rydId, limit = 100) => {
    try {
      const data = await envioQuery<{ RYDParticipant: RawRYDParticipant[] }>(
        RYD_PARTICIPANTS_QUERY,
        { limit }
      );
      set((s) => ({
        ryds: patchRYD(s.ryds, rydId, {
          participants: data.RYDParticipant.map(mapParticipant),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchWinners: async (rydId) => {
    try {
      const data = await envioQuery<{ RYDWinner: RawRYDWinner[] }>(RYD_WINNERS_QUERY);
      set((s) => ({
        ryds: patchRYD(s.ryds, rydId, {
          winners: data.RYDWinner.map(mapWinner),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchDailySnapshots: async (rydId, limit = 30) => {
    try {
      const data = await envioQuery<{ RYDDailySnapshot: RawRYDSnapshot[] }>(
        RYD_DAILY_SNAPSHOTS_QUERY,
        { limit }
      );
      set((s) => ({
        ryds: patchRYD(s.ryds, rydId, {
          dailySnapshots: data.RYDDailySnapshot.map(mapRYDSnapshot),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserParticipation: async (rydId, address) => {
    try {
      const data = await envioQuery<{ RYDParticipant: RawRYDParticipant[] }>(
        RYD_USER_PARTICIPATION_QUERY,
        { address: address.toLowerCase() }
      );
      const raw = data.RYDParticipant[0];
      set((s) => ({
        ryds: patchRYD(s.ryds, rydId, {
          userParticipation: raw ? mapParticipant(raw) : null,
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchAllForRYD: async (rydId, userAddress) => {
    const promises: Promise<void>[] = [
      get().fetchParticipants(rydId),
      get().fetchWinners(rydId),
      get().fetchDailySnapshots(rydId),
    ];
    if (userAddress) {
      promises.push(get().fetchUserParticipation(rydId, userAddress));
    }
    await Promise.all(promises);
  },

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      await get().fetchAllRYDStates();
      const rydIds = Object.keys(get().ryds);
      await Promise.all(rydIds.map((id) => get().fetchAllForRYD(id, userAddress)));
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  reset: () => set({ ...initialState, ryds: {} }),
}));

// ── Formatting helpers ───────────────────────────────────────────────

export const formatRYDAmount = (amount: bigint, decimals = 6): string => {
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

export const formatRYDStatus = (status: RYDStatus): string => {
  const labels: Record<RYDStatus, string> = {
    Open: "Open",
    DrawRequested: "Drawing…",
    ReadyToResolve: "Ready to Resolve",
    Finished: "Finished",
  };
  return labels[status];
};

export const shortenAddress = (address: string): string => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};
