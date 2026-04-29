import { create } from "zustand";
import type { TwoPool } from "@/shared/types/twoPool";
import { INITIAL_TWO_POOLS } from "@/shared/constants/twoPoolMocks";

export interface TwoPoolsState {
  pools: TwoPool[];
  getPoolById: (id: string) => TwoPool | undefined;
  setPools: (pools: TwoPool[]) => void;
  reset: () => void;
}

const snapshot = (): TwoPool[] => [...INITIAL_TWO_POOLS];

export const useTwoPoolsStore = create<TwoPoolsState>((set, get) => ({
  pools: snapshot(),

  getPoolById: (id) => get().pools.find((p) => p.id === id),

  setPools: (pools) => set({ pools }),

  reset: () => set({ pools: snapshot() }),
}));
