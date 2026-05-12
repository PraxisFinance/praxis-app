import { create } from "zustand";
import { fetchTwoPoolStates } from "@/shared/api/twoPoolEnvio";
import { trpcClient } from "@/lib/trpc/vanillaClient";
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

      const addresses = pools.map((p) => p.id);
      const contracts = await trpcClient.twoPoolContracts.byAddresses.query({ addresses });

      const contractsByAddress = new Map(contracts.map((c) => [c.address.toLowerCase(), c]));

      const merged = pools.map((pool) => {
        const contract = contractsByAddress.get(pool.id.toLowerCase());
        if (!contract) return pool;
        return {
          ...pool,
          title: contract.name,
          description: contract.description,
        };
      });

      set({ pools: merged, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  getPoolById: (id) => get().pools.find((p) => p.id === id),

  setPools: (pools) => set({ pools }),

  reset: () => set(initial),
}));
