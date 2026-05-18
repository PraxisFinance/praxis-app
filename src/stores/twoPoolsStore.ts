import { create } from "zustand";
import { fetchTwoPoolStates } from "@/shared/api/twoPoolEnvio";
import { trpcClient } from "@/lib/trpc/vanillaClient";
import { useActiveVaultStore } from "@/stores/activeVaultStore";
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
      const activeVaultId = useActiveVaultStore.getState().activeVaultId;
      if (!activeVaultId) {
        set({ pools: [], loading: false });
        return;
      }

      const [pools, contracts] = await Promise.all([
        fetchTwoPoolStates(),
        trpcClient.twoPoolContracts.byVault.query({ vault: activeVaultId }),
      ]);

      const allowedAddresses = new Set(contracts.map((contract) => contract.address.toLowerCase()));
      const scopedPools = pools.filter((pool) => allowedAddresses.has(pool.id.toLowerCase()));

      const contractsByAddress = new Map(contracts.map((c) => [c.address.toLowerCase(), c]));

      const merged = scopedPools.map((pool) => {
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

useActiveVaultStore.subscribe(
  (state) => state.activeVaultId,
  (next, prev) => {
    if (next !== prev) {
      void useTwoPoolsStore.getState().fetchPools();
    }
  }
);
