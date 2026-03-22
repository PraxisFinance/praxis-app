import { create } from "zustand";

export interface Vault {
  id: string;
  name: string;
  maturityDate: number;
  vaultSize: bigint;
  expectedApy: number;
  status: "open" | "closed";
}

export interface UserPosition {
  id: string;
  vaultId: string;
  amount: bigint;
  stakeTime: number;
  status: "open" | "closed";
}

interface DepositsState {
  vaults: Vault[];
  positions: UserPosition[];

  setVaults: (vaults: Vault[]) => void;
  addVault: (vault: Vault) => void;
  updateVault: (id: string, updates: Partial<Omit<Vault, "id">>) => void;

  setPositions: (positions: UserPosition[]) => void;
  addPosition: (position: UserPosition) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<Omit<UserPosition, "id">>) => void;

  getVaultById: (id: string) => Vault | undefined;
  getPositionsByVaultId: (vaultId: string) => UserPosition[];
  getTotalUserDeposits: () => bigint;
  getOpenVaults: () => Vault[];

  reset: () => void;
}

const USDC_DECIMALS = 6;

const MOCK_VAULTS: Vault[] = [
  {
    id: "vault-1",
    name: "Yield Vault - 30 Day",
    maturityDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
    vaultSize: BigInt("500000000000"), // 500,000 USDC
    expectedApy: 5.2,
    status: "open",
  },
  {
    id: "vault-2",
    name: "Yield Vault - 90 Day",
    maturityDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
    vaultSize: BigInt("1200000000000"), // 1,200,000 USDC
    expectedApy: 8.5,
    status: "open",
  },
  {
    id: "vault-3",
    name: "Stable Vault - 60 Day",
    maturityDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
    vaultSize: BigInt("2000000000000"), // 2,000,000 USDC
    expectedApy: 6.8,
    status: "open",
  },
  {
    id: "vault-4",
    name: "Yield Vault - 14 Day",
    maturityDate: Date.now() - 5 * 24 * 60 * 60 * 1000, // matured 5 days ago
    vaultSize: BigInt("300000000000"), // 300,000 USDC
    expectedApy: 4.0,
    status: "closed",
  },
];

const MOCK_POSITIONS: UserPosition[] = [
  {
    id: "pos-1",
    vaultId: "vault-1",
    amount: BigInt("25000000000"), // 25,000 USDC
    stakeTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    status: "open",
  },
  {
    id: "pos-2",
    vaultId: "vault-2",
    amount: BigInt("50000000000"), // 50,000 USDC
    stakeTime: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    status: "open",
  },
  {
    id: "pos-3",
    vaultId: "vault-3",
    amount: BigInt("10000000000"), // 10,000 USDC
    stakeTime: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    status: "closed",
  },
];

const initialState = {
  vaults: [] as Vault[],
  positions: [] as UserPosition[],
};

export const useDepositsStore = create<DepositsState>((set, get) => ({
  ...initialState,

  setVaults: (vaults) => set({ vaults }),

  addVault: (vault) =>
    set((state) => ({
      vaults: [...state.vaults, vault],
    })),

  updateVault: (id, updates) =>
    set((state) => ({
      vaults: state.vaults.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    })),

  setPositions: (positions) => set({ positions }),

  addPosition: (position) =>
    set((state) => ({
      positions: [...state.positions, position],
    })),

  removePosition: (id) =>
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    })),

  updatePosition: (id, updates) =>
    set((state) => ({
      positions: state.positions.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  getVaultById: (id) => {
    return get().vaults.find((v) => v.id === id);
  },

  getPositionsByVaultId: (vaultId) => {
    return get().positions.filter((p) => p.vaultId === vaultId);
  },

  getTotalUserDeposits: () => {
    return get().positions.reduce((sum, p) => sum + p.amount, BigInt(0));
  },

  getOpenVaults: () => {
    return get().vaults.filter((v) => v.status === "open");
  },

  reset: () => set(initialState),
}));

export const loadMockDeposits = () => {
  const store = useDepositsStore.getState();
  store.setVaults(MOCK_VAULTS);
  store.setPositions(MOCK_POSITIONS);
};

export const formatUSDC = (amount: bigint): string => {
  const value = Number(amount) / 10 ** USDC_DECIMALS;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const getTimeUntilMaturity = (maturityDate: number): string => {
  const diff = maturityDate - Date.now();
  if (diff <= 0) return "Matured";

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days > 0) return `${days} days`;

  const hours = Math.floor(diff / (60 * 60 * 1000));
  return `${hours} hours`;
};

export const getStakeDuration = (stakeTime: number): string => {
  const diff = Date.now() - stakeTime;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  return `${days} days`;
};
