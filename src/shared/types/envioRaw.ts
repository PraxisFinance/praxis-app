/**
 * Raw Envio GraphQL row shapes for the history/portfolio queries.
 *
 * All BigInt-on-chain values arrive as strings from Hasura. Counts and boolean
 * flags stay as `number` / `boolean`. Nullable timestamps are `string | null`.
 *
 * Types are derived from Zod schemas so the same definition serves both
 * compile-time type safety and runtime boundary validation.
 */
import { z } from "zod";

// ─── Q0 — Chain head ─────────────────────────────────────────────────────────

export const RawChainMetaSchema = z.object({
  /** Latest block fully processed by the Envio indexer on Base (chain 8453). */
  latest_processed_block: z.number(),
});
export type RawChainMeta = z.infer<typeof RawChainMetaSchema>;

export const EnvioHeadResponseSchema = z.object({
  chain_metadata: z.array(RawChainMetaSchema),
});
export type EnvioHeadResponse = z.infer<typeof EnvioHeadResponseSchema>;

// ─── Q1 — User delta events ──────────────────────────────────────────────────

export const RawVaultDepositSchema = z.object({
  id: z.string(),
  vault: z.string(),
  /** Principal deposited, USDC 6dp, BigInt string. */
  principal: z.string(),
  /** Buy-in cost of the principal tranche (PT price × principal), USDC 6dp, BigInt string. */
  buyIn: z.string(),
  receiver: z.string(),
});
export type RawVaultDeposit = z.infer<typeof RawVaultDepositSchema>;

export const RawVaultWithdrawSchema = z.object({
  id: z.string(),
  vault: z.string(),
  /** Total USDC returned (principal + any yield), USDC 6dp, BigInt string. */
  amount: z.string(),
  /** Yield component of the withdrawal, USDC 6dp, BigInt string. */
  yieldPayout: z.string(),
  receiver: z.string(),
});
export type RawVaultWithdraw = z.infer<typeof RawVaultWithdrawSchema>;

export const RawVaultRedeemYieldSchema = z.object({
  id: z.string(),
  vault: z.string(),
  /** YT tokens burned, USDC 6dp, BigInt string. */
  ytBurn: z.string(),
  /** USDC received for the redeemed yield, USDC 6dp, BigInt string. */
  payout: z.string(),
  receiver: z.string(),
});
export type RawVaultRedeemYield = z.infer<typeof RawVaultRedeemYieldSchema>;

export const RawRYDDepositedSchema = z.object({
  id: z.string(),
  ryd: z.string(),
  user: z.string(),
  amount: z.string(),
});
export type RawRYDDeposited = z.infer<typeof RawRYDDepositedSchema>;

export const RawRYDWithdrawnSchema = z.object({
  id: z.string(),
  ryd: z.string(),
  user: z.string(),
  amount: z.string(),
});
export type RawRYDWithdrawn = z.infer<typeof RawRYDWithdrawnSchema>;

export const RawRYDPrizeClaimedSchema = z.object({
  id: z.string(),
  ryd: z.string(),
  winner: z.string(),
  amount: z.string(),
});
export type RawRYDPrizeClaimed = z.infer<typeof RawRYDPrizeClaimedSchema>;

export const RawCPFPlaceBetSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  poolId: z.string(),
  user: z.string(),
  amount: z.string(),
  /** true = FOR side, false = AGAINST side. */
  inFavor: z.boolean(),
});
export type RawCPFPlaceBet = z.infer<typeof RawCPFPlaceBetSchema>;

export const RawCPFCancelBetSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  user: z.string(),
  poolId: z.string(),
});
export type RawCPFCancelBet = z.infer<typeof RawCPFCancelBetSchema>;

export const RawCPFRewardClaimedSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  poolId: z.string(),
  user: z.string(),
  payout: z.string(),
});
export type RawCPFRewardClaimed = z.infer<typeof RawCPFRewardClaimedSchema>;

export const RawCPFWithdrawSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  user: z.string(),
  amount: z.string(),
});
export type RawCPFWithdraw = z.infer<typeof RawCPFWithdrawSchema>;

export const RawTwoPoolDepositedSchema = z.object({
  id: z.string(),
  pool: z.string(),
  user: z.string(),
  /** 0 = STABLE, 1 = ELEVATED (Int! in the Envio schema). */
  side: z.number().int(),
  grossAmount: z.string(),
  fee: z.string(),
  netAmount: z.string(),
});
export type RawTwoPoolDeposited = z.infer<typeof RawTwoPoolDepositedSchema>;

export const RawTwoPoolClaimedSchema = z.object({
  id: z.string(),
  pool: z.string(),
  user: z.string(),
  /** 0 = STABLE, 1 = ELEVATED (Int! in the Envio schema). */
  side: z.number().int(),
  ytOut: z.string(),
});
export type RawTwoPoolClaimed = z.infer<typeof RawTwoPoolClaimedSchema>;

export const UserDeltaResponseSchema = z.object({
  PraxisVault_Deposit: z.array(RawVaultDepositSchema),
  PraxisVault_Withdraw: z.array(RawVaultWithdrawSchema),
  PraxisVault_RedeemYield: z.array(RawVaultRedeemYieldSchema),
  PraxisRYD_Deposited: z.array(RawRYDDepositedSchema),
  PraxisRYD_Withdrawn: z.array(RawRYDWithdrawnSchema),
  PraxisRYD_PrizeClaimed: z.array(RawRYDPrizeClaimedSchema),
  PraxisCPF_PlaceBet: z.array(RawCPFPlaceBetSchema),
  PraxisCPF_CancelBet: z.array(RawCPFCancelBetSchema),
  PraxisCPF_RewardClaimed: z.array(RawCPFRewardClaimedSchema),
  PraxisCPF_Withdraw: z.array(RawCPFWithdrawSchema),
  PraxisTwoPool_Deposited: z.array(RawTwoPoolDepositedSchema),
  PraxisTwoPool_Claimed: z.array(RawTwoPoolClaimedSchema),
});
export type UserDeltaResponse = z.infer<typeof UserDeltaResponseSchema>;

// ─── Q2 — User derived state ─────────────────────────────────────────────────

export const RawUserPositionSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  address: z.string(),
  totalDeposited: z.string(),
  totalWithdrawn: z.string(),
  currentBalance: z.string(),
  totalBuyInCost: z.string(),
  totalYieldClaimed: z.string(),
  depositCount: z.number(),
  firstDepositAt: z.string(),
  lastActivityAt: z.string(),
});
export type RawUserPosition = z.infer<typeof RawUserPositionSchema>;

export const RawRYDParticipantSchema = z.object({
  id: z.string(),
  ryd_id: z.string(),
  address: z.string(),
  depositAmount: z.string(),
  depositCount: z.number(),
  withdrawCount: z.number(),
  firstDepositAt: z.string(),
  lastActivityAt: z.string(),
  isWinner: z.boolean(),
  hasClaimed: z.boolean(),
  prizeAmount: z.string(),
  winProbabilityBps: z.number(),
});
export type RawRYDParticipant = z.infer<typeof RawRYDParticipantSchema>;

export const RawRYDWinnerSchema = z.object({
  id: z.string(),
  ryd_id: z.string(),
  address: z.string(),
  rank: z.number(),
  prizeAmount: z.string(),
  depositedAmount: z.string(),
  winProbabilityBps: z.number(),
  /** Unix seconds as BigInt string; "0" if not yet claimed. */
  claimedAt: z.string(),
});
export type RawRYDWinner = z.infer<typeof RawRYDWinnerSchema>;

export const RawCPFPoolPositionSchema = z.object({
  id: z.string(),
  cpfAddress: z.string(),
  pool_id: z.string(),
  address: z.string(),
  balanceInFavor: z.string(),
  balanceAgainst: z.string(),
  claimed: z.boolean(),
  lastActivityAt: z.string().nullable(),
});
export type RawCPFPoolPosition = z.infer<typeof RawCPFPoolPositionSchema>;

export const RawTwoPoolUserSchema = z.object({
  id: z.string(),
  pool_id: z.string(),
  address: z.string(),
  stableGrossDeposited: z.string(),
  stableFees: z.string(),
  stableNetDeposited: z.string(),
  stableDepositCount: z.number(),
  elevatedGrossDeposited: z.string(),
  elevatedFees: z.string(),
  elevatedNetDeposited: z.string(),
  elevatedDepositCount: z.number(),
  stableClaimedYt: z.string(),
  elevatedClaimedYt: z.string(),
  hasClaimedStable: z.boolean(),
  hasClaimedElevated: z.boolean(),
  firstDepositAt: z.string().nullable(),
  lastActivityAt: z.string().nullable(),
});
export type RawTwoPoolUser = z.infer<typeof RawTwoPoolUserSchema>;

export const UserDerivedStateResponseSchema = z.object({
  UserPosition: z.array(RawUserPositionSchema),
  RYDParticipant: z.array(RawRYDParticipantSchema),
  RYDWinner: z.array(RawRYDWinnerSchema),
  CPFPoolPosition: z.array(RawCPFPoolPositionSchema),
  TwoPoolUser: z.array(RawTwoPoolUserSchema),
});
export type UserDerivedStateResponse = z.infer<typeof UserDerivedStateResponseSchema>;

// ─── Q3 — Global pool/market state ──────────────────────────────────────────

export const RawVaultStateSchema = z.object({
  id: z.string(),
  /** Vault maturity — unix seconds, BigInt string. */
  maturity: z.string(),
  pt: z.string(),
  yt: z.string(),
  totalBalance: z.string(),
  totalYieldPaid: z.string(),
  isPaused: z.boolean(),
  lastUpdatedAt: z.string(),
});
export type RawVaultState = z.infer<typeof RawVaultStateSchema>;

export const RawVaultDailySnapshotSchema = z.object({
  id: z.string(),
  vault_id: z.string(),
  /** "YYYY-MM-DD" UTC. */
  date: z.string(),
  /** Unix seconds of snapshot, BigInt string. */
  timestamp: z.string(),
  totalBalance: z.string(),
  dailyYield: z.string(),
});
export type RawVaultDailySnapshot = z.infer<typeof RawVaultDailySnapshotSchema>;

export const RawRYDStateSchema = z.object({
  id: z.string(),
  vault: z.string(),
  yt: z.string(),
  /** Unix seconds, BigInt string. */
  endTime: z.string(),
  state: z.string(),
  totalDeposits: z.string(),
  participantCount: z.number(),
  numWinners: z.number(),
  minDeposit: z.string(),
  prizePerWinner: z.string(),
  /** BigInt string; "0" when VRF draw not yet requested. */
  vrfRequestId: z.string(),
  /** BigInt string; "0" when not yet requested. */
  drawRequestedAt: z.string(),
  /** BigInt string; "0" when randomness not yet received. */
  randomnessReceivedAt: z.string(),
  /** BigInt string; "0" when draw not yet finished. */
  finishedAt: z.string(),
  totalClaimed: z.string(),
  claimsRemaining: z.number(),
  lastUpdatedAt: z.string(),
});
export type RawRYDState = z.infer<typeof RawRYDStateSchema>;

export const RawCPFPoolStateSchema = z.object({
  id: z.string(),
  cpfAddress: z.string(),
  /** BigInt string — Envio serialises BigInt! as string in JSON. */
  poolId: z.string(),
  /** Empty string when no CTF condition is attached. */
  conditionId: z.string(),
  state: z.string(),
  stakeInFavor: z.string(),
  stakeAgainst: z.string(),
  /**
   * Non-null string from Envio. Empty string ("") when the pool has not
   * been resolved yet. Check with `poolState.winningOutcome !== ""` rather
   * than `!== null`.
   */
  winningOutcome: z.string(),
  totalWinningStake: z.string(),
  totalLosingStake: z.string(),
  createdAt: z.string(),
  /** BigInt string; "0" when not yet resolved. */
  resolvedAt: z.string(),
  lastUpdatedAt: z.string(),
  betCount: z.number(),
  uniqueBettors: z.number(),
});
export type RawCPFPoolState = z.infer<typeof RawCPFPoolStateSchema>;

/**
 * TwoPool state as fetched by the history GlobalState query.
 * Distinct from `RawTwoPoolState` in `twoPoolEnvio.ts`, which omits
 * `vault` and `yt` and includes additional display-only fields.
 */
export const RawTwoPoolHistoryStateSchema = z.object({
  id: z.string(),
  state: z.string(),
  vault: z.string(),
  yt: z.string(),
  sideTVLStable: z.string(),
  sideTVLElevated: z.string(),
  subsidyBucketStable: z.string(),
  subsidyBucketElevated: z.string(),
  actualRate: z.string(),
  curveStableOut: z.string(),
  curveElevatedOut: z.string(),
  sideFinalAllocationStable: z.string(),
  sideFinalAllocationElevated: z.string(),
  totalClaimedYtStable: z.string(),
  totalClaimedYtElevated: z.string(),
  /** BigInt string; "0" when not yet resolved. */
  resolvedAt: z.string(),
  lastUpdatedAt: z.string(),
});
export type RawTwoPoolHistoryState = z.infer<typeof RawTwoPoolHistoryStateSchema>;

export const GlobalStateResponseSchema = z.object({
  VaultState: z.array(RawVaultStateSchema),
  VaultDailySnapshot: z.array(RawVaultDailySnapshotSchema),
  RYDState: z.array(RawRYDStateSchema),
  CPFPoolState: z.array(RawCPFPoolStateSchema),
  TwoPoolState: z.array(RawTwoPoolHistoryStateSchema),
});
export type GlobalStateResponse = z.infer<typeof GlobalStateResponseSchema>;
