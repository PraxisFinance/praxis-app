export type AchievementStatus = "in_progress" | "completed";

export interface AchievementPublic {
  id: string;
  category: string;
  title: string;
  description: string;
  targetValue: number | null;
  xp: number | null; // null = dynamic, shown as "variable" in UI
}

export interface UserAchievementView extends AchievementPublic {
  status: AchievementStatus;
  currentValue: number;
  xpAwarded: number;
  completedAt: string | null; // ISO-8601
}

export interface UserAchievementsResponse {
  achievements: UserAchievementView[];
  totalXp: number;
}

export type AchievementTrigger =
  | "wallet.connect"
  | "funds.claim"
  | "vault.deposit"
  | "vault.withdraw"
  | "cpf.predict"
  | "cpf.claim"
  | "twopool.deposit"
  | "twopool.claim"
  | "ryd.enter"
  | "ryd.claim";

export interface CheckAchievementDto {
  trigger: AchievementTrigger;
  payload?: Record<string, unknown>;
}

export interface CheckResult {
  updated: UserAchievementView[];
  newlyCompleted: string[];
  xpGained: number;
}

export interface ReferralConnectionEntry {
  address: string;
  status: "pending" | "qualified";
  points: number | null;
}

export interface RefereeEntry extends ReferralConnectionEntry {
  createdAt: string; // ISO-8601
}

export interface ReferralStats {
  code: string;
  referrer: ReferralConnectionEntry | null;
  referees: RefereeEntry[];
  pendingCount: number;
  qualifiedCount: number;
}

export interface ReferrerInfo {
  referrer: string | null;
  status: "pending" | "qualified" | null;
}

export interface BindResult {
  referrer: string;
  status: "pending" | "qualified";
  backwardXp: number;
}

/** Returned by GET /referrals/bind-params?code=:code — all data the frontend needs to produce an EIP-712 signature. */
export interface BindParams {
  /** Resolved wallet address of the referrer. */
  referrerAddress: string;
  /** Current EIP-712 nonce for the calling trader (from PraxisFeeRouter.nonces). */
  nonce: string; // stringified bigint — safe across JSON
  /** Unix timestamp (seconds) after which the signature is invalid. */
  deadline: number;
  /** PraxisFeeRouter contract address — required for the EIP-712 verifyingContract field. */
  feeRouterAddress: string;
  /** Chain ID the contract is deployed on. */
  chainId: number;
}
