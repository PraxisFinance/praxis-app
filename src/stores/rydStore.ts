import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";
import { useActiveVaultStore } from "@/stores/activeVaultStore";

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


// ── Store ────────────────────────────────────────────────────────────

interface RYDStoreState {
  ryds: Record<string, RYDData>;
  activeRYDId: string | null;
  loading: boolean;
  error: string | null;

  setActiveRYD: (id: string) => void;
  getActiveRYD: () => RYDData | undefined;
  getRYD: (id: string) => RYDData | undefined;

  fetchAll: (userAddress?: string) => Promise<void>;
  fetchAllRYDStates: () => Promise<void>;

  reset: () => void;
}

const initialState = {
  ryds: {} as Record<string, RYDData>,
  activeRYDId: null as string | null,
  loading: false,
  error: null as string | null,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const RYD_FULL_LOAD_QUERY = `
  query RYDFullLoad($address: String!) {
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
    participants: RYDParticipant(order_by: { depositAmount: desc }, limit: 100) {
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
    winners: RYDWinner(order_by: { rank: asc }) {
      id
      address
      rank
      prizeAmount
      depositedAmount
      winProbabilityBps
      claimedAt
    }
    snapshots: RYDDailySnapshot(order_by: { timestamp: desc }, limit: 30) {
      id
      date
      timestamp
      totalDeposits
      participantCount
      dailyDeposits
      dailyWithdrawals
      netFlow
    }
    userParticipation: RYDParticipant(where: { address: { _eq: $address } }, limit: 1) {
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

const RYD_BOOTSTRAP_QUERY = `
  query RYDBootstrap {
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
    participants: RYDParticipant(order_by: { depositAmount: desc }, limit: 100) {
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
    winners: RYDWinner(order_by: { rank: asc }) {
      id
      address
      rank
      prizeAmount
      depositedAmount
      winProbabilityBps
      claimedAt
    }
    snapshots: RYDDailySnapshot(order_by: { timestamp: desc }, limit: 30) {
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

// ── Batched response types ────────────────────────────────────────────

interface RYDFullLoadResponse {
  RYDState: RawRYDState[];
  participants: RawRYDParticipant[];
  winners: RawRYDWinner[];
  snapshots: RawRYDSnapshot[];
  userParticipation: RawRYDParticipant[];
}

interface RYDBootstrapResponse {
  RYDState: RawRYDState[];
  participants: RawRYDParticipant[];
  winners: RawRYDWinner[];
  snapshots: RawRYDSnapshot[];
}

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

// ── Zustand store ────────────────────────────────────────────────────

export const useRYDStore = create<RYDStoreState>((set, get) => ({
  ...initialState,

  setActiveRYD: (id) => set({ activeRYDId: id }),

  getActiveRYD: () => {
    const { ryds, activeRYDId } = get();
    return activeRYDId ? ryds[activeRYDId] : undefined;
  },

  getRYD: (id) => get().ryds[id],

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      const activeYt = useActiveVaultStore.getState().activeYtAddress;

      let rydStates: RawRYDState[];
      let participants: RawRYDParticipant[];
      let winners: RawRYDWinner[];
      let snapshots: RawRYDSnapshot[];
      let userParticipation: RawRYDParticipant | null = null;

      if (userAddress) {
        const data = await envioQuery<RYDFullLoadResponse>(RYD_FULL_LOAD_QUERY, {
          address: userAddress.toLowerCase(),
        });
        rydStates = data.RYDState;
        participants = data.participants;
        winners = data.winners;
        snapshots = data.snapshots;
        userParticipation = data.userParticipation[0] ?? null;
      } else {
        const data = await envioQuery<RYDBootstrapResponse>(RYD_BOOTSTRAP_QUERY);
        rydStates = data.RYDState;
        participants = data.participants;
        winners = data.winners;
        snapshots = data.snapshots;
      }

      const scopedRows = rydStates.filter(
        (raw) => raw.yt.toLowerCase() === activeYt.toLowerCase()
      );

      const nextRyds: Record<string, RYDData> = {};
      for (const raw of scopedRows) {
        nextRyds[raw.id] = {
          state: mapRYDState(raw),
          participants: participants.map(mapParticipant),
          winners: winners.map(mapWinner),
          dailySnapshots: snapshots.map(mapRYDSnapshot),
          userParticipation: userParticipation ? mapParticipant(userParticipation) : null,
        };
      }

      const activeId = get().activeRYDId;
      set({
        ryds: nextRyds,
        activeRYDId: activeId && nextRyds[activeId] ? activeId : (scopedRows[0]?.id ?? null),
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchAllRYDStates: async () => {
    await get().fetchAll();
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

useActiveVaultStore.subscribe(
  (state) => state.activeYtAddress,
  (next, prev) => {
    if (next !== prev) {
      void useRYDStore.getState().fetchAllRYDStates();
    }
  }
);
