import { create } from "zustand";

export interface Claim {
  id: string;
  eventId: string;
  income: bigint;
  claimedAt?: number;
  status: "pending" | "claimed";
}

interface ClaimsState {
  claims: Claim[];

  setClaims: (claims: Claim[]) => void;
  addClaim: (claim: Claim) => void;
  removeClaim: (id: string) => void;
  markClaimed: (id: string) => void;
  getClaimsByEventId: (eventId: string) => Claim[];
  getTotalPendingIncome: () => bigint;
  reset: () => void;
}

const MOCK_CLAIMS: Claim[] = [
  {
    id: "claim-1",
    eventId: "sport-1",
    income: BigInt("150000000"), // 150 YT
    status: "pending",
  },
  {
    id: "claim-2",
    eventId: "econ-2",
    income: BigInt("320000000"), // 320 YT
    status: "pending",
  },
  {
    id: "claim-3",
    eventId: "random-1",
    income: BigInt("10000000000"), // 10,000 YT
    status: "pending",
  },
  {
    id: "claim-4",
    eventId: "sport-2",
    income: BigInt("75000000"), // 75 YT
    claimedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: "claimed",
  },
];

const initialState = {
  claims: [] as Claim[],
};

export const useClaimsStore = create<ClaimsState>((set, get) => ({
  ...initialState,

  setClaims: (claims) => set({ claims }),

  addClaim: (claim) =>
    set((state) => ({
      claims: [...state.claims, claim],
    })),

  removeClaim: (id) =>
    set((state) => ({
      claims: state.claims.filter((c) => c.id !== id),
    })),

  markClaimed: (id) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === id
          ? { ...c, status: "claimed" as const, claimedAt: Date.now() }
          : c,
      ),
    })),

  getClaimsByEventId: (eventId) => {
    return get().claims.filter((c) => c.eventId === eventId);
  },

  getTotalPendingIncome: () => {
    return get()
      .claims.filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + c.income, BigInt(0));
  },

  reset: () => set(initialState),
}));

export const loadMockClaims = () => {
  useClaimsStore.getState().setClaims(MOCK_CLAIMS);
};

export const formatIncome = (income: bigint, decimals: number = 6): string => {
  const value = Number(income) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
