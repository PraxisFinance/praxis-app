import { create } from "zustand";
import { envioQuery, toBigInt } from "@/shared/api/envioClient";
import { buildMockVaultsRecord } from "@/shared/constants/earnMocks";

// ── Envio-derived types ──────────────────────────────────────────────

export interface VaultState {
  id: string;
  maturity: bigint;
  pt: string;
  yt: string;
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

  fetchAll: (userAddress?: string) => Promise<void>;
  fetchUserPosition: (vaultId: string, address: string) => Promise<void>;
  fetchUserDeposits: (vaultId: string, address: string) => Promise<void>;
  fetchUserWithdrawals: (vaultId: string, address: string) => Promise<void>;
  fetchUserRedeems: (vaultId: string, address: string) => Promise<void>;

  reset: () => void;
}

const initialState = {
  vaults: {} as Record<string, VaultData>,
  activeVaultId: null as string | null,
  loading: false,
  error: null as string | null,
};

// ── GraphQL queries ──────────────────────────────────────────────────

const FULL_LOAD_QUERY = `
  query FullLoad($address: String!) {
    VaultState {
      id
      maturity
      pt
      yt
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
    VaultDailySnapshot(order_by: [{ vault_id: asc }, { timestamp: desc }]) {
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
    UserPosition(where: { address: { _eq: $address } }) {
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
    PraxisVault_Deposit(where: { receiver: { _eq: $address } }) {
      id
      vault
      principal
      buyIn
      receiver
    }
    PraxisVault_Withdraw(where: { receiver: { _eq: $address } }) {
      id
      vault
      amount
      yieldPayout
      receiver
    }
    PraxisVault_RedeemYield(where: { receiver: { _eq: $address } }) {
      id
      vault
      ytBurn
      payout
      receiver
    }
  }
`;

const BOOTSTRAP_QUERY = `
  query Bootstrap {
    VaultState {
      id
      maturity
      pt
      yt
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
    VaultDailySnapshot(order_by: [{ vault_id: asc }, { timestamp: desc }]) {
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

// ── Batched response types ────────────────────────────────────────────

interface FullLoadResponse {
  VaultState: RawVaultState[];
  VaultDailySnapshot: RawSnapshot[];
  UserPosition: RawUserPosition[];
  PraxisVault_Deposit: RawDeposit[];
  PraxisVault_Withdraw: RawWithdraw[];
  PraxisVault_RedeemYield: RawRedeem[];
}

interface BootstrapResponse {
  VaultState: RawVaultState[];
  VaultDailySnapshot: RawSnapshot[];
}

// ── Raw → typed mappers ──────────────────────────────────────────────

interface RawVaultState {
  id: string;
  maturity: string;
  pt: string;
  yt: string;
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
    pt: raw.pt,
    yt: raw.yt,
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

  fetchAll: async (userAddress) => {
    set({ loading: true, error: null });
    try {
      const nextVaults: Record<string, VaultData> = {};

      if (userAddress) {
        const data = await envioQuery<FullLoadResponse>(FULL_LOAD_QUERY, {
          address: userAddress.toLowerCase(),
        });

        for (const raw of data.VaultState) {
          nextVaults[raw.id] = { ...emptyVaultData(), state: mapVaultState(raw) };
        }

        for (const raw of data.VaultDailySnapshot) {
          const snap = mapSnapshot(raw);
          const vault = nextVaults[snap.vault_id];
          if (vault) vault.dailySnapshots.push(snap);
        }
        for (const vault of Object.values(nextVaults)) {
          if (vault.dailySnapshots.length > 30) vault.dailySnapshots = vault.dailySnapshots.slice(0, 30);
        }

        for (const raw of data.UserPosition) {
          const pos = mapUserPosition(raw);
          const vault = nextVaults[pos.vault_id];
          if (vault) vault.userPosition = pos;
        }

        for (const raw of data.PraxisVault_Deposit) {
          const dep = mapDeposit(raw);
          const vault = nextVaults[dep.vault];
          if (vault) vault.deposits.push(dep);
        }

        for (const raw of data.PraxisVault_Withdraw) {
          const wd = mapWithdraw(raw);
          const vault = nextVaults[wd.vault];
          if (vault) vault.withdrawals.push(wd);
        }

        for (const raw of data.PraxisVault_RedeemYield) {
          const rd = mapRedeem(raw);
          const vault = nextVaults[rd.vault];
          if (vault) vault.redeems.push(rd);
        }

        const activeId = get().activeVaultId;
        set({
          vaults: nextVaults,
          activeVaultId: activeId && nextVaults[activeId] ? activeId : (data.VaultState[0]?.id ?? null),
          loading: false,
        });
      } else {
        const data = await envioQuery<BootstrapResponse>(BOOTSTRAP_QUERY);

        for (const raw of data.VaultState) {
          nextVaults[raw.id] = { ...emptyVaultData(), state: mapVaultState(raw) };
        }

        for (const raw of data.VaultDailySnapshot) {
          const snap = mapSnapshot(raw);
          const vault = nextVaults[snap.vault_id];
          if (vault) vault.dailySnapshots.push(snap);
        }
        for (const vault of Object.values(nextVaults)) {
          if (vault.dailySnapshots.length > 30) vault.dailySnapshots = vault.dailySnapshots.slice(0, 30);
        }

        const activeId = get().activeVaultId;
        set({
          vaults: nextVaults,
          activeVaultId: activeId && nextVaults[activeId] ? activeId : (data.VaultState[0]?.id ?? null),
          loading: false,
        });
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchUserPosition: async (vaultId, address) => {
    try {
      const data = await envioQuery<{ UserPosition: RawUserPosition[] }>(USER_POSITION_QUERY, {
        vault_id: vaultId.toLowerCase(),
        address: address.toLowerCase(),
      });
      const raw = data.UserPosition[0];
      set((s) => ({
        vaults: patchVault(s.vaults, vaultId, {
          userPosition: raw ? mapUserPosition(raw) : null,
        }),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  fetchUserDeposits: async (vaultId, address) => {
    try {
      const data = await envioQuery<{ PraxisVault_Deposit: RawDeposit[] }>(USER_DEPOSITS_QUERY, {
        vault: vaultId.toLowerCase(),
        receiver: address.toLowerCase(),
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
        { vault: vaultId.toLowerCase(), receiver: address.toLowerCase() }
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
        { vault: vaultId.toLowerCase(), receiver: address.toLowerCase() }
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

  reset: () => set(initialState),
}));

export function loadMockDeposits(): void {
  const vaults = buildMockVaultsRecord();
  const now = nowSeconds();
  const firstActiveId =
    Object.values(vaults).find((v) => v.state && v.state.maturity > now)?.state?.id ?? null;

  useDepositsStore.setState({
    vaults,
    activeVaultId: firstActiveId,
    loading: false,
    error: null,
  });
}

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
