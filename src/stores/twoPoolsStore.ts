import { create } from "zustand";
import { fetchTwoPoolStates } from "@/shared/api/twoPoolEnvio";
import type { TwoPool } from "@/shared/types/twoPool";

export interface TwoPoolsState {
  pools: TwoPool[];
  loading: boolean;
  error: string | null;
  fetchPools: () => Promise<void>;
  getPoolById: (id: string) => TwoPool | undefined;
  setPools: (pools: TwoPool[]) => void;
  reset: () => void;
}

const initial = {
  pools: [] as TwoPool[],
  loading: false,
  error: null as string | null,
};

export const useTwoPoolsStore = create<TwoPoolsState>((set, get) => ({
  ...initial,

  fetchPools: async () => {
    set({ loading: true, error: null });
    try {
      const pools = await fetchTwoPoolStates();
      set({ pools, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  getPoolById: (id) => get().pools.find((p) => p.id === id),

  setPools: (pools) => set({ pools }),

  reset: () => set(initial),
}));
