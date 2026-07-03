export interface ProgressLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  address: `0x${string}`;
  accountLevel: number;
  score: number;
}

export interface ProgressLeaderboardHydration {
  entries: ProgressLeaderboardEntry[];
  userEntry: ProgressLeaderboardEntry | null;
  userRank: number | null;
}

export interface LeaderboardSliceState {
  entries: ProgressLeaderboardEntry[];
  userEntry: ProgressLeaderboardEntry | null;
  userRank: number | null;
  loading: boolean;
  error: string | null;
}

export interface LeaderboardSliceActions {
  hydrateLeaderboard: (payload: ProgressLeaderboardHydration) => void;
  setLeaderboardLoading: (loading: boolean) => void;
  setLeaderboardError: (error: string | null) => void;
  resetLeaderboard: () => void;
}

export type LeaderboardSlice = LeaderboardSliceState & LeaderboardSliceActions;
