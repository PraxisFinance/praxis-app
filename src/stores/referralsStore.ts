import { create } from "zustand";
import type { ReferralStats, ReferralConnectionEntry, RefereeEntry } from "@/shared/types/api";

export type { ReferralConnectionEntry, RefereeEntry };

interface ReferralsState {
  code: string | null;
  referrer: ReferralConnectionEntry | null;
  referees: RefereeEntry[];
  pendingCount: number;
  qualifiedCount: number;

  populate: (stats: ReferralStats) => void;
  reset: () => void;
}

const initialState = {
  code: null as string | null,
  referrer: null as ReferralConnectionEntry | null,
  referees: [] as RefereeEntry[],
  pendingCount: 0,
  qualifiedCount: 0,
};

export const useReferralsStore = create<ReferralsState>((set) => ({
  ...initialState,

  populate: ({ code, referrer, referees, pendingCount, qualifiedCount }) =>
    set({ code, referrer, referees, pendingCount, qualifiedCount }),

  reset: () => set(initialState),
}));

export const formatScore = (score: number): string => score.toLocaleString("en-US");
