import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";
import { trpcClient } from "@/lib/trpc/vanillaClient";
import type { OffchainEventData } from "@/lib/trpc/routers/offchainEvents";

// ── Types ────────────────────────────────────────────────────────────

export type CPFPoolStatus = "Open" | "Locked" | "Resolved" | "Canceled" | "Voided";

export interface CPFGlobalState {
  id: string;
  minDeposit: bigint;
  feeBps: bigint;
  treasury: string;
  lastUpdatedAt: bigint;
}

export interface CPFUserAvailableBalance {
  id: string;
  balance: bigint;
  lastUpdatedAt: bigint;
}

export interface CPFPoolState {
  id: string;
  cpfAddress: string;
  poolId: bigint;
  ctfAddress: string;
  conditionId: string;
  state: CPFPoolStatus;
  stakeInFavor: bigint;
  stakeAgainst: bigint;
  winningOutcome: string;
  totalWinningStake: bigint;
  totalLosingStake: bigint;
  createdAt: bigint;
  resolvedAt: bigint;
  lastUpdatedAt: bigint;
  betCount: number;
  uniqueBettors: number;
}

export interface CPFPoolPosition {
  id: string;
  cpfAddress: string;
  pool_id: string;
  address: string;
  balanceInFavor: bigint;
  balanceAgainst: bigint;
  claimed: boolean;
  lastActivityAt: bigint;
}

export interface CPFBetEvent {
  id: string;
  cpf: string;
  poolId: bigint;
  user: string;
  amount: bigint;
  inFavor: boolean;
}

export interface CPFRewardClaimedEvent {
  id: string;
  cpf: string;
  poolId: bigint;
  user: string;
  payout: bigint;
}

export interface CPFWithdrawEvent {
  id: string;
  cpf: string;
  user: string;
  amount: bigint;
}

export interface CPFDeploymentInfo {
  /** The CPF contract address — used as cpfAddress on pool records. */
  id: string;
  stakingToken: string;
  endTime: bigint;
}

// ── Per-pool data bundle ─────────────────────────────────────────────

export interface CPFPoolData {
  state: CPFPoolState | null;
  userPosition: CPFPoolPosition | null;
  userBets: CPFBetEvent[];
}

function emptyPoolData(): CPFPoolData {
  return { state: null, userPosition: null, userBets: [] };
}

// ── Store interface ──────────────────────────────────────────────────

interface EventsState {
  globalState: CPFGlobalState | null;
  userBalance: CPFUserAvailableBalance | null;
  pools: Record<string, CPFPoolData>;
  /** Cached CPF contract address, keyed by the YT address it was resolved from. */
  cpfAddressByYt: Record<string, string>;
  loading: boolean;
  error: string | null;
  offchainByContractId: Record<string, OffchainEventData>;

  getPool: (poolId: string) => CPFPoolData | undefined;
  getOpenPools: () => CPFPoolState[];
  getResolvedPools: () => CPFPoolState[];

  fetchGlobalState: (cpfAddress: string) => Promise<void>;
  fetchUserBalance: (cpfAddress: string, userAddress: string) => Promise<void>;
  resolveCPFAddress: (ytAddress: string) => Promise<string | null>;
  fetchAllPoolStates: (vaultId?: string, ytAddress?: string) => Promise<void>;
  fetchOffchainMetadata: (vaultId?: string) => Promise<void>;
  fetchUserPosition: (poolId: string, userAddress: string) => Promise<void>;
  fetchUserBets: (poolId: string, userAddress: string) => Promise<void>;
  fetchAllForPool: (poolId: string, userAddress?: string) => Promise<void>;
  fetchAll: (userAddress?: string) => Promise<void>;

  reset: () => void;
}

const initialState = {
  globalState: null as CPFGlobalState | null,
  userBalance: null as CPFUserAvailableBalance | null,
  pools: {} as Record<string, CPFPoolData>,
  cpfAddressByYt: {} as Record<string, string>,
  loading: false,
  error: null as string | null,
  offchainByContractId: {} as Record<string, OffchainEventData>,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const CPF_DEPLOYMENT_BY_YT_QUERY = `
  query CPFDeploymentByYT($stakingToken: String!) {
    CPFDeploymentInfo(where: { stakingToken: { _eq: $stakingToken } }, limit: 1) {
      id
      stakingToken
      endTime
    }
  }
`;

const GLOBAL_STATE_QUERY = `
  query CPFGlobalState($id: String!) {
    CPFGlobalState(where: { id: { _eq: $id } }, limit: 1) {
      id
      minDeposit
      feeBps
      treasury
      lastUpdatedAt
    }
  }
`;

const USER_BALANCE_QUERY = `
  query CPFUserBalance($id: String!) {
    CPFUserAvailableBalance(where: { id: { _eq: $id } }, limit: 1) {
      id
      balance
      lastUpdatedAt
    }
  }
`;

const ALL_POOL_STATES_QUERY = `
  query AllCPFPools {
    CPFPoolState(order_by: { createdAt: desc }) {
      id
      cpfAddress
      poolId
      ctfAddress
      conditionId
      state
      stakeInFavor
      stakeAgainst
      winningOutcome
      totalWinningStake
      totalLosingStake
      createdAt
      resolvedAt
      lastUpdatedAt
      betCount
      uniqueBettors
    }
  }
`;

const POOL_STATES_BY_CPF_QUERY = `
  query CPFPoolsByAddress($cpfAddress: String!) {
    CPFPoolState(
      where: { cpfAddress: { _eq: $cpfAddress } }
      order_by: { createdAt: desc }
    ) {
      id
      cpfAddress
      poolId
      ctfAddress
      conditionId
      state
      stakeInFavor
      stakeAgainst
      winningOutcome
      totalWinningStake
      totalLosingStake
      createdAt
      resolvedAt
      lastUpdatedAt
      betCount
      uniqueBettors
    }
  }
`;

const USER_POSITION_QUERY = `
  query CPFUserPosition($pool_id: String!, $address: String!) {
    CPFPoolPosition(
      where: { pool_id: { _eq: $pool_id }, address: { _eq: $address } }
      limit: 1
    ) {
      id
      cpfAddress
      pool_id
      address
      balanceInFavor
      balanceAgainst
      claimed
      lastActivityAt
    }
  }
`;

const USER_BETS_QUERY = `
  query CPFUserBets($poolId: numeric!, $user: String!) {
    PraxisCPF_PlaceBet(
      where: { poolId: { _eq: $poolId }, user: { _eq: $user } }
    ) {
      id
      cpf
      poolId
      user
      amount
      inFavor
    }
  }
`;

// ── Raw → typed mappers ──────────────────────────────────────────────

interface RawCPFDeploymentInfo {
  id: string;
  stakingToken: string;
  endTime: string;
}

function mapDeploymentInfo(raw: RawCPFDeploymentInfo): CPFDeploymentInfo {
  return {
    id: raw.id,
    stakingToken: raw.stakingToken,
    endTime: toBigInt(raw.endTime),
  };
}

interface RawCPFGlobalState {
  id: string;
  minDeposit: string;
  feeBps: string;
  treasury: string;
  lastUpdatedAt: string;
}

function mapGlobalState(raw: RawCPFGlobalState): CPFGlobalState {
  return {
    id: raw.id,
    minDeposit: toBigInt(raw.minDeposit),
    feeBps: toBigInt(raw.feeBps),
    treasury: raw.treasury,
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
  };
}

interface RawUserBalance {
  id: string;
  balance: string;
  lastUpdatedAt: string;
}

function mapUserBalance(raw: RawUserBalance): CPFUserAvailableBalance {
  return {
    id: raw.id,
    balance: toBigInt(raw.balance),
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
  };
}

interface RawCPFPoolState {
  id: string;
  cpfAddress: string;
  poolId: string;
  ctfAddress: string;
  conditionId: string;
  state: string;
  stakeInFavor: string;
  stakeAgainst: string;
  winningOutcome: string;
  totalWinningStake: string;
  totalLosingStake: string;
  createdAt: string;
  resolvedAt: string;
  lastUpdatedAt: string;
  betCount: number;
  uniqueBettors: number;
}

const KNOWN_POOL_STATUSES: readonly CPFPoolStatus[] = [
  "Open",
  "Locked",
  "Resolved",
  "Canceled",
  "Voided",
];

function normalizeIndexerPoolStatus(raw: string): CPFPoolStatus {
  const s = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return (KNOWN_POOL_STATUSES as readonly string[]).includes(s) ? (s as CPFPoolStatus) : "Open";
}

function mapPoolState(raw: RawCPFPoolState): CPFPoolState {
  return {
    id: raw.id,
    cpfAddress: raw.cpfAddress,
    poolId: toBigInt(raw.poolId),
    ctfAddress: raw.ctfAddress,
    conditionId: raw.conditionId,
    state: normalizeIndexerPoolStatus(raw.state),
    stakeInFavor: toBigInt(raw.stakeInFavor),
    stakeAgainst: toBigInt(raw.stakeAgainst),
    winningOutcome: raw.winningOutcome,
    totalWinningStake: toBigInt(raw.totalWinningStake),
    totalLosingStake: toBigInt(raw.totalLosingStake),
    createdAt: toBigInt(raw.createdAt),
    resolvedAt: toBigInt(raw.resolvedAt),
    lastUpdatedAt: toBigInt(raw.lastUpdatedAt),
    betCount: raw.betCount,
    uniqueBettors: raw.uniqueBettors,
  };
}

interface RawCPFPoolPosition {
  id: string;
  cpfAddress: string;
  pool_id: string;
  address: string;
  balanceInFavor: string;
  balanceAgainst: string;
  claimed: boolean;
  lastActivityAt: string;
}

function mapPoolPosition(raw: RawCPFPoolPosition): CPFPoolPosition {
  return {
    id: raw.id,
    cpfAddress: raw.cpfAddress,
    pool_id: raw.pool_id,
    address: raw.address,
    balanceInFavor: toBigInt(raw.balanceInFavor),
    balanceAgainst: toBigInt(raw.balanceAgainst),
    claimed: raw.claimed,
    lastActivityAt: toBigInt(raw.lastActivityAt),
  };
}

interface RawCPFBet {
  id: string;
  cpf: string;
  poolId: string;
  user: string;
  amount: string;
  inFavor: boolean;
}

function mapBet(raw: RawCPFBet): CPFBetEvent {
  return {
    id: raw.id,
    cpf: raw.cpf,
    poolId: toBigInt(raw.poolId),
    user: raw.user,
    amount: toBigInt(raw.amount),
    inFavor: raw.inFavor,
  };
}

// ── Helper ───────────────────────────────────────────────────────────

function patchPool(
  pools: Record<string, CPFPoolData>,
  poolId: string,
  patch: Partial<CPFPoolData>
): Record<string, CPFPoolData> {
  const existing = pools[poolId] ?? emptyPoolData();
  return { ...pools, [poolId]: { ...existing, ...patch } };
}

// ── Zustand store ────────────────────────────────────────────────────

export const useEventsStore = create<EventsState>((set, get) => ({
  ...initialState,

  getPool: (poolId) => get().pools[poolId],

  getOpenPools: () =>
    Object.values(get().pools)
      .map((p) => p.state)
      .filter((s): s is CPFPoolState => s !== null && s.state === "Open"),

  getResolvedPools: () =>
    Object.values(get().pools)
      .map((p) => p.state)
      .filter((s): s is CPFPoolState => s !== null && s.state === "Resolved"),

  fetchGlobalState: async (cpfAddress) => {
    try {
      const data = await envioQuery<{ CPFGlobalState: RawCPFGlobalState[] }>(GLOBAL_STATE_QUERY, {
        id: cpfAddress.toLowerCase(),
      });
      const raw = data.CPFGlobalState[0];
      if (raw) set({ globalState: mapGlobalState(raw) });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserBalance: async (cpfAddress, userAddress) => {
    try {
      const id = `${cpfAddress.toLowerCase()}-${userAddress.toLowerCase()}`;
      const data = await envioQuery<{ CPFUserAvailableBalance: RawUserBalance[] }>(
        USER_BALANCE_QUERY,
        { id }
      );
      const raw = data.CPFUserAvailableBalance[0];
      set({ userBalance: raw ? mapUserBalance(raw) : null });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  resolveCPFAddress: async (ytAddress: string): Promise<string | null> => {
    const data = await envioQuery<{ CPFDeploymentInfo: RawCPFDeploymentInfo[] }>(
      CPF_DEPLOYMENT_BY_YT_QUERY,
      { stakingToken: ytAddress.toLowerCase() }
    );
    const raw = data.CPFDeploymentInfo[0];
    return raw ? mapDeploymentInfo(raw).id : null;
  },

  fetchAllPoolStates: async (vaultId?: string, ytAddress?: string) => {
    try {
      set({ loading: true, error: null });

      let rawPools: RawCPFPoolState[];
      if (ytAddress) {
        const ytKey = ytAddress.toLowerCase();
        let cpfAddr = get().cpfAddressByYt[ytKey];

        if (!cpfAddr) {
          cpfAddr = (await get().resolveCPFAddress(ytAddress)) ?? "";
          if (!cpfAddr) {
            set({ pools: {}, loading: false });
            return;
          }
          set((s) => ({
            cpfAddressByYt: { ...s.cpfAddressByYt, [ytKey]: cpfAddr },
          }));
        }

        const data = await envioQuery<{ CPFPoolState: RawCPFPoolState[] }>(
          POOL_STATES_BY_CPF_QUERY,
          { cpfAddress: cpfAddr }
        );
        rawPools = data.CPFPoolState;
      } else {
        const data = await envioQuery<{ CPFPoolState: RawCPFPoolState[] }>(ALL_POOL_STATES_QUERY);
        rawPools = data.CPFPoolState;
      }

      const nextPools = { ...get().pools };
      for (const raw of rawPools) {
        const mapped = mapPoolState(raw);
        const existing = nextPools[mapped.id] ?? emptyPoolData();
        nextPools[mapped.id] = { ...existing, state: mapped };
      }
      set({ pools: nextPools, loading: false });
      await get().fetchOffchainMetadata(vaultId);
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchOffchainMetadata: async (vaultId?: string) => {
    const poolStates = Object.values(get().pools)
      .map((p) => p.state)
      .filter((s): s is CPFPoolState => s !== null);

    const ids = new Set<string>();
    for (const p of poolStates) {
      ids.add(String(p.poolId));
    }

    const idList = [...ids];
    if (idList.length === 0) return;

    try {
      const rows = await trpcClient.offchainEvents.byContractIds.query({
        ids: idList,
        vault: vaultId,
      });

      const byId: Record<string, OffchainEventData> = {};
      for (const e of rows) {
        for (const raw of [e.contractEventId, e.conditionId]) {
          if (!raw) continue;
          byId[raw] = e;
          if (raw.startsWith("0x")) byId[raw.toLowerCase()] = e;
        }
      }
      set({ offchainByContractId: byId });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserPosition: async (poolId, userAddress) => {
    try {
      const data = await envioQuery<{ CPFPoolPosition: RawCPFPoolPosition[] }>(
        USER_POSITION_QUERY,
        { pool_id: poolId.toLowerCase(), address: userAddress.toLowerCase() }
      );
      const raw = data.CPFPoolPosition[0];
      set((s) => ({
        pools: patchPool(s.pools, poolId, {
          userPosition: raw ? mapPoolPosition(raw) : null,
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserBets: async (poolId, userAddress) => {
    try {
      const poolState = get().pools[poolId]?.state;
      const numericPoolId = poolState ? Number(poolState.poolId) : null;
      if (numericPoolId === null) return;
      const data = await envioQuery<{ PraxisCPF_PlaceBet: RawCPFBet[] }>(USER_BETS_QUERY, {
        poolId: numericPoolId,
        user: userAddress.toLowerCase(),
      });
      set((s) => ({
        pools: patchPool(s.pools, poolId, {
          userBets: data.PraxisCPF_PlaceBet.map(mapBet),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchAllForPool: async (poolId, userAddress) => {
    const promises: Promise<void>[] = [];
    if (userAddress) {
      promises.push(
        get().fetchUserPosition(poolId, userAddress),
        get().fetchUserBets(poolId, userAddress)
      );
    }
    await Promise.all(promises);
  },

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      await get().fetchAllPoolStates();
      const poolIds = Object.keys(get().pools);
      await Promise.all(poolIds.map((id) => get().fetchAllForPool(id, userAddress)));
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  reset: () => set(initialState),
}));

// ── Helpers ──────────────────────────────────────────────────────────

const USDC_DECIMALS = 6;

/** Implied odds ratio for inFavor side (0–1). */
export function impliedOdds(pool: CPFPoolState): { favor: number; against: number } {
  const total = pool.stakeInFavor + pool.stakeAgainst;
  if (total === BigInt(0)) return { favor: 0.5, against: 0.5 };
  return {
    favor: Number(pool.stakeInFavor) / Number(total),
    against: Number(pool.stakeAgainst) / Number(total),
  };
}

export const formatPool = (amount: bigint, decimals = USDC_DECIMALS): string => {
  const value = Number(amount) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCPFStatus = (status: CPFPoolStatus): string => {
  const labels: Record<CPFPoolStatus, string> = {
    Open: "Open",
    Locked: "Locked",
    Resolved: "Resolved",
    Canceled: "Canceled",
    Voided: "Voided",
  };
  return labels[status];
};

export const getTimeUntilLock = (lockTime: number): string => {
  const diff = lockTime - Date.now();
  if (diff <= 0) return "Locked";
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};
