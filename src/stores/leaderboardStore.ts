import { create } from 'zustand';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  address: `0x${string}`;
  score: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  userRank: number | null;

  setEntries: (entries: LeaderboardEntry[]) => void;
  setUserRank: (rank: number | null) => void;
  getTopN: (n: number) => LeaderboardEntry[];
  reset: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    rank: 1,
    name: 'whale.eth',
    address: '0x1111111111111111111111111111111111111111',
    score: 125000,
  },
  {
    id: 'lb-2',
    rank: 2,
    name: 'degen.base',
    address: '0x2222222222222222222222222222222222222222',
    score: 98500,
  },
  {
    id: 'lb-3',
    rank: 3,
    name: 'trader.eth',
    address: '0x3333333333333333333333333333333333333333',
    score: 87200,
  },
  {
    id: 'lb-4',
    rank: 4,
    name: '0x4444...4444',
    address: '0x4444444444444444444444444444444444444444',
    score: 76800,
  },
  {
    id: 'lb-5',
    rank: 5,
    name: 'alpha.eth',
    address: '0x5555555555555555555555555555555555555555',
    score: 65400,
  },
  {
    id: 'lb-6',
    rank: 6,
    name: 'yield.base',
    address: '0x6666666666666666666666666666666666666666',
    score: 54200,
  },
  {
    id: 'lb-7',
    rank: 7,
    name: '0x7777...7777',
    address: '0x7777777777777777777777777777777777777777',
    score: 48900,
  },
  {
    id: 'lb-8',
    rank: 8,
    name: 'hodler.eth',
    address: '0x8888888888888888888888888888888888888888',
    score: 42100,
  },
  {
    id: 'lb-9',
    rank: 9,
    name: 'stacker.base',
    address: '0x9999999999999999999999999999999999999999',
    score: 38700,
  },
  {
    id: 'lb-10',
    rank: 10,
    name: '0xAAAA...AAAA',
    address: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    score: 35200,
  },
];

const initialState = {
  entries: [] as LeaderboardEntry[],
  userRank: null as number | null,
};

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  ...initialState,

  setEntries: (entries) => set({ entries }),

  setUserRank: (userRank) => set({ userRank }),

  getTopN: (n) => {
    return get().entries.slice(0, n);
  },

  reset: () => set(initialState),
}));

export const loadMockLeaderboard = () => {
  const store = useLeaderboardStore.getState();
  store.setEntries(MOCK_LEADERBOARD);
  store.setUserRank(42);
};

export const formatRank = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};
