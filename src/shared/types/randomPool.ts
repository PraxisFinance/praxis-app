/**
 * Random rewards pool card — discriminated by `status`.
 */
export type RandomPoolRemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type RandomPoolLive = {
  id: string;
  title: string;
  /** Optional coin / token icon */
  iconUrl?: string;
  status: "live";
  tvl: string;
  expectedYield: string;
  usersIn: number;
  /** 0–100 */
  progressPercent: number;
  remainingTime: RandomPoolRemainingTime;
};

export type RandomPoolEnded = {
  id: string;
  title: string;
  iconUrl?: string;
  status: "ended";
  tvl: string;
  earnings: string;
  usersWon: number;
  /** Typically 100 when pool ended */
  progressPercent: number;
  /** If true, show “You won” and “Claim rewards” */
  userWon: boolean;
};

export type RandomPool = RandomPoolLive | RandomPoolEnded;

/** User row in “Users in pool” (details / API). */
export type RandomPoolUserInPool = {
  username: string;
  amount: string;
  avatarUrl?: string;
  /** Falls back to wrapped USDC icon when omitted */
  currencyIconUrl?: string;
};
