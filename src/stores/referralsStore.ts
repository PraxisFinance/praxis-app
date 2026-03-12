import { create } from 'zustand';

export interface Referral {
  id: string;
  name: string;
  score: number;
}

interface ReferralsState {
  referralCode: string | null;
  referrals: Referral[];

  setReferralCode: (code: string | null) => void;
  setReferrals: (referrals: Referral[]) => void;
  addReferral: (referral: Referral) => void;
  getTotalScore: () => number;
  reset: () => void;
}

const MOCK_REFERRAL_CODE = 'PRAXIS-7X9K2M';

const MOCK_REFERRALS: Referral[] = [
  {
    id: 'ref-1',
    name: 'alice.eth',
    score: 2500,
  },
  {
    id: 'ref-2',
    name: 'bob.base',
    score: 1800,
  },
  {
    id: 'ref-3',
    name: '0x742d...8dB2',
    score: 950,
  },
  {
    id: 'ref-4',
    name: 'charlie.eth',
    score: 3200,
  },
  {
    id: 'ref-5',
    name: '0x1234...5678',
    score: 420,
  },
];

const initialState = {
  referralCode: null as string | null,
  referrals: [] as Referral[],
};

export const useReferralsStore = create<ReferralsState>((set, get) => ({
  ...initialState,

  setReferralCode: (referralCode) => set({ referralCode }),

  setReferrals: (referrals) => set({ referrals }),

  addReferral: (referral) => set((state) => ({
    referrals: [...state.referrals, referral],
  })),

  getTotalScore: () => {
    return get().referrals.reduce((sum, r) => sum + r.score, 0);
  },

  reset: () => set(initialState),
}));

export const loadMockReferrals = () => {
  const store = useReferralsStore.getState();
  store.setReferralCode(MOCK_REFERRAL_CODE);
  store.setReferrals(MOCK_REFERRALS);
};

export const formatScore = (score: number): string => {
  return score.toLocaleString('en-US');
};
