import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";

// ── Envio-derived types ──────────────────────────────────────────────

export interface VaultState {
  id: string;
  maturity: bigint;
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
  vault_id: string;
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
  vault_id: string;
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
  vault: string;
  principal: bigint;
  buyIn: bigint;
  receiver: string;
}

export interface WithdrawEvent {
  id: string;
  vault: string;
  amount: bigint;
  yieldPayout: bigint;
  receiver: string;
}

export interface RedeemYieldEvent {
  id: string;
  vault: string;
  ytBurn: bigint;
  payout: bigint;
  receiver: string;
}

// ── Per-vault data bundle ────────────────────────────────────────────

export interface VaultData {
  state: VaultState | null;
  userPosition: UserPosition | null;
  dailySnapshots: VaultDailySnapshot[];
  deposits: DepositEvent[];
  withdrawals: WithdrawEvent[];
  redeems: RedeemYieldEvent[];
}

function emptyVaultData(): VaultData {
  return {
    state: null,
    userPosition: null,
    dailySnapshots: [],
    deposits: [],
    withdrawals: [],
    redeems: [],
  };
}

// ── Store ────────────────────────────────────────────────────────────

interface DepositsState {
  vaults: Record<string, VaultData>;
  activeVaultId: string | null;
  loading: boolean;
  error: string | null;

  setActiveVault: (vaultId: string) => void;
  getActiveVault: () => VaultData | undefined;
  getVault: (vaultId: string) => VaultData | undefined;
  getActiveVaults: () => VaultState[];
  getMaturedVaults: () => VaultState[];
  getUserPositions: () => UserPosition[];

  fetchAllVaultStates: () => Promise<void>;
  fetchUserPosition: (vaultId: string, address: string) => Promise<void>;
  fetchDailySnapshots: (vaultId: string, limit?: number) => Promise<void>;
  fetchUserDeposits: (vaultId: string, address: string) => Promise<void>;
  fetchUserWithdrawals: (vaultId: string, address: string) => Promise<void>;
  fetchUserRedeems: (vaultId: string, address: string) => Promise<void>;
  fetchAllForVault: (vaultId: string, userAddress?: string) => Promise<void>;
  fetchAll: (userAddress?: string) => Promise<void>;

  reset: () => void;
}

const initialState = {
  vaults: {} as Record<string, VaultData>,
  activeVaultId: null as string | null,
  loading: false,
  error: null as string | null,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const ALL_VAULT_STATES_QUERY = `
  query AllVaultStates {
    VaultState {
      id
      maturity
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
  query UserPosition($vault_id: String!, $address: String!) {
    UserPosition(
      where: { vault_id: { _eq: $vault_id }, address: { _eq: $address } }
      limit: 1
    ) {
      id
      vault_id
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
  query VaultDailySnapshots($vault_id: String!, $limit: Int!) {
    VaultDailySnapshot(
      where: { vault_id: { _eq: $vault_id } }
      order_by: { timestamp: desc }
      limit: $limit
    ) {
      id
      vault_id
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
  query UserDeposits($vault: String!, $receiver: String!) {
    PraxisVault_Deposit(
      where: { vault: { _eq: $vault }, receiver: { _eq: $receiver } }
    ) {
      id
      vault
      principal
      buyIn
      receiver
    }
  }
`;

const USER_WITHDRAWALS_QUERY = `
  query UserWithdrawals($vault: String!, $receiver: String!) {
    PraxisVault_Withdraw(
      where: { vault: { _eq: $vault }, receiver: { _eq: $receiver } }
    ) {
      id
      vault
      amount
      yieldPayout
      receiver
    }
  }
`;

const USER_REDEEMS_QUERY = `
  query UserRedeems($vault: String!, $receiver: String!) {
    PraxisVault_RedeemYield(
      where: { vault: { _eq: $vault }, receiver: { _eq: $receiver } }
    ) {
      id
      vault
      ytBurn
      payout
      receiver
    }
  }
`;

// ── Raw → typed mappers ──────────────────────────────────────────────

interface RawVaultState {
  id: string;
  maturity: string;
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
    maturity: toBigInt(raw.maturity),
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
  vault_id: string;
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
    vault_id: raw.vault_id,
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
  vault_id: string;
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
    vault_id: raw.vault_id,
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
  vault: string;
  principal: string;
  buyIn: string;
  receiver: string;
}

function mapDeposit(raw: RawDeposit): DepositEvent {
  return {
    id: raw.id,
    vault: raw.vault,
    principal: toBigInt(raw.principal),
    buyIn: toBigInt(raw.buyIn),
    receiver: raw.receiver,
  };
}

interface RawWithdraw {
  id: string;
  vault: string;
  amount: string;
  yieldPayout: string;
  receiver: string;
}

function mapWithdraw(raw: RawWithdraw): WithdrawEvent {
  return {
    id: raw.id,
    vault: raw.vault,
    amount: toBigInt(raw.amount),
    yieldPayout: toBigInt(raw.yieldPayout),
    receiver: raw.receiver,
  };
}

interface RawRedeem {
  id: string;
  vault: string;
  ytBurn: string;
  payout: string;
  receiver: string;
}

function mapRedeem(raw: RawRedeem): RedeemYieldEvent {
  return {
    id: raw.id,
    vault: raw.vault,
    ytBurn: toBigInt(raw.ytBurn),
    payout: toBigInt(raw.payout),
    receiver: raw.receiver,
  };
}

// ── Helper to patch a single vault entry ─────────────────────────────

function patchVault(
  vaults: Record<string, VaultData>,
  vaultId: string,
  patch: Partial<VaultData>
): Record<string, VaultData> {
  const existing = vaults[vaultId] ?? emptyVaultData();
  return { ...vaults, [vaultId]: { ...existing, ...patch } };
}

function nowSeconds(): bigint {
  return BigInt(Math.floor(Date.now() / 1000));
}

// ── Zustand store ────────────────────────────────────────────────────

const USDC_DECIMALS = 6;

export const useDepositsStore = create<DepositsState>((set, get) => ({
  ...initialState,

  setActiveVault: (vaultId) => set({ activeVaultId: vaultId }),

  getActiveVault: () => {
    const { vaults, activeVaultId } = get();
    return activeVaultId ? vaults[activeVaultId] : undefined;
  },

  getVault: (vaultId) => get().vaults[vaultId],

  getActiveVaults: () => {
    const now = nowSeconds();
    return Object.values(get().vaults)
      .map((v) => v.state)
      .filter((s): s is VaultState => s !== null && s.maturity > now);
  },

  getMaturedVaults: () => {
    const now = nowSeconds();
    return Object.values(get().vaults)
      .map((v) => v.state)
      .filter((s): s is VaultState => s !== null && s.maturity <= now);
  },

  getUserPositions: () => {
    return Object.values(get().vaults)
      .map((v) => v.userPosition)
      .filter((p): p is UserPosition => p !== null && p.currentBalance > BigInt(0));
  },

  fetchAllVaultStates: async () => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ VaultState: RawVaultState[] }>(ALL_VAULT_STATES_QUERY);
      const nextVaults = { ...get().vaults };
      for (const raw of data.VaultState) {
        const mapped = mapVaultState(raw);
        const existing = nextVaults[mapped.id] ?? emptyVaultData();
        nextVaults[mapped.id] = { ...existing, state: mapped };
      }
      const activeId = get().activeVaultId;
      set({
        vaults: nextVaults,
        activeVaultId: activeId && nextVaults[activeId] ? activeId : (data.VaultState[0]?.id ?? null),
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchUserPosition: async (vaultId, address) => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ UserPosition: RawUserPosition[] }>(USER_POSITION_QUERY, {
        vault_id: vaultId,
        address,
      });
      const raw = data.UserPosition[0];
      set((s) => ({
        vaults: patchVault(s.vaults, vaultId, {
          userPosition: raw ? mapUserPosition(raw) : null,
        }),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchDailySnapshots: async (vaultId, limit = 30) => {
    try {
      set({ loading: true, error: null });
      const data = await envioQuery<{ VaultDailySnapshot: RawSnapshot[] }>(
        DAILY_SNAPSHOTS_QUERY,
        { vault_id: vaultId, limit }
      );
      set((s) => ({
        vaults: patchVault(s.vaults, vaultId, {
          dailySnapshots: data.VaultDailySnapshot.map(mapSnapshot),
        }),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchUserDeposits: async (vaultId, address) => {
    try {
      const data = await envioQuery<{ PraxisVault_Deposit: RawDeposit[] }>(USER_DEPOSITS_QUERY, {
        vault: vaultId,
        receiver: address,
      });
      set((s) => ({
        vaults: patchVault(s.vaults, vaultId, {
          deposits: data.PraxisVault_Deposit.map(mapDeposit),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserWithdrawals: async (vaultId, address) => {
    try {
      const data = await envioQuery<{ PraxisVault_Withdraw: RawWithdraw[] }>(
        USER_WITHDRAWALS_QUERY,
        { vault: vaultId, receiver: address }
      );
      set((s) => ({
        vaults: patchVault(s.vaults, vaultId, {
          withdrawals: data.PraxisVault_Withdraw.map(mapWithdraw),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserRedeems: async (vaultId, address) => {
    try {
      const data = await envioQuery<{ PraxisVault_RedeemYield: RawRedeem[] }>(
        USER_REDEEMS_QUERY,
        { vault: vaultId, receiver: address }
      );
      set((s) => ({
        vaults: patchVault(s.vaults, vaultId, {
          redeems: data.PraxisVault_RedeemYield.map(mapRedeem),
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchAllForVault: async (vaultId, userAddress) => {
    try {
      const promises: Promise<void>[] = [get().fetchDailySnapshots(vaultId)];
      if (userAddress) {
        promises.push(
          get().fetchUserPosition(vaultId, userAddress),
          get().fetchUserDeposits(vaultId, userAddress),
          get().fetchUserWithdrawals(vaultId, userAddress),
          get().fetchUserRedeems(vaultId, userAddress)
        );
      }
      await Promise.all(promises);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      await get().fetchAllVaultStates();
      const vaultIds = Object.keys(get().vaults);
      await Promise.all(vaultIds.map((id) => get().fetchAllForVault(id, userAddress)));
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
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
