import { z } from "zod";

/**
 * Monotonic schema version — bump this constant to force a full recompute for
 * all users the next time their cache row is read by the orchestrator.
 */
export const CURRENT_SCHEMA_VERSION = 3;

// ─── Activity kinds ──────────────────────────────────────────────────────────

export type ActivityKind =
  | "VAULT_DEPOSIT"
  | "VAULT_WITHDRAW"
  | "VAULT_REDEEM_YIELD"
  | "RYD_DEPOSIT"
  | "RYD_WITHDRAW"
  | "RYD_CLAIM"
  | "CPF_BET"
  | "CPF_CANCEL"
  | "CPF_CLAIM"
  | "CPF_WITHDRAW"
  | "TWOPOOL_DEPOSIT"
  | "TWOPOOL_CLAIM";

export const ActivityKindSchema = z.enum([
  "VAULT_DEPOSIT",
  "VAULT_WITHDRAW",
  "VAULT_REDEEM_YIELD",
  "RYD_DEPOSIT",
  "RYD_WITHDRAW",
  "RYD_CLAIM",
  "CPF_BET",
  "CPF_CANCEL",
  "CPF_CLAIM",
  "CPF_WITHDRAW",
  "TWOPOOL_DEPOSIT",
  "TWOPOOL_CLAIM",
]);

// ─── Position types ──────────────────────────────────────────────────────────

export type VaultPosition = {
  /** Lowercase vault contract address. */
  vaultId: string;
  /** Current USDC balance, 6 decimal places, serialised as BigInt string. */
  balance: string;
  /** Accrued yield not yet redeemed, USDC 6dp, BigInt string. */
  ytClaimable: string;
  /** Vault maturity timestamp — unix seconds, BigInt string. */
  maturity: string;
};

export const VaultPositionSchema = z.object({
  vaultId: z.string(),
  balance: z.string(),
  ytClaimable: z.string(),
  maturity: z.string(),
});

export type RydPosition = {
  /** RYD contract address (lowercase). */
  rydId: string;
  /** Pool lifecycle state: "OPEN" | "DRAWING" | "CLOSED". */
  state: string;
  /** Principal deposited, USDC 6dp, BigInt string. */
  deposit: string;
  isWinner: boolean;
  /** Prize amount, USDC 6dp, BigInt string. */
  prize: string;
  claimed: boolean;
};

export const RydPositionSchema = z.object({
  rydId: z.string(),
  state: z.string(),
  deposit: z.string(),
  isWinner: z.boolean(),
  prize: z.string(),
  claimed: z.boolean(),
});

/** Which side of a binary CPF market the user bet on. */
export type CpfSide = "FOR" | "AGAINST";

export const CpfSideSchema = z.enum(["FOR", "AGAINST"]);

export type CpfPosition = {
  /** CPF contract address (EIP-55 checksummed). */
  cpfAddress: string;
  poolId: string;
  side: CpfSide;
  /** Original stake, USDC 6dp, BigInt string. */
  amount: string;
  /** Indicative mark-to-market value (see valuation doc), USDC 6dp, BigInt string. */
  markValue: string;
  resolved: boolean;
  /** Non-zero only when resolved and the user is on the winning side, USDC 6dp, BigInt string. */
  claimable: string;
};

export const CpfPositionSchema = z.object({
  cpfAddress: z.string(),
  poolId: z.string(),
  side: CpfSideSchema,
  amount: z.string(),
  markValue: z.string(),
  resolved: z.boolean(),
  claimable: z.string(),
});

export type TwoPoolPosition = {
  poolId: string;
  /** Which tranche of the TwoPool the user is in. */
  side: "STABLE" | "ELEVATED";
  /** Net USDC deposited (deposits minus withdrawals), USDC 6dp, BigInt string. */
  netDeposited: string;
  /** Yield tokens claimable, USDC 6dp, BigInt string. */
  ytClaimable: string;
};

export const TwoPoolPositionSchema = z.object({
  poolId: z.string(),
  side: z.enum(["STABLE", "ELEVATED"]),
  netDeposited: z.string(),
  ytClaimable: z.string(),
});

// ─── Activity feed ───────────────────────────────────────────────────────────

export type ActivityItem = {
  /**
   * Envio raw event id with the chain prefix stripped:
   * `${paddedBlock}_${paddedLogIndex}` (raw: `8453_${paddedBlock}_${paddedLogIndex}`).
   */
  id: string;
  kind: ActivityKind;
  /** Pre-formatted display string for the UI activity feed row. */
  title: string;
  /** Signed USDC amount, 6dp, BigInt string. Positive = inflow, negative = outflow. */
  amount: string;
  /** Millisecond epoch timestamp for client-side `formatHistoryTime`. */
  time: number;
  /** Product contract address (EIP-55 checksummed). */
  productAddr: string;
  /** Pool/vault/ryd address that disambiguates the event within the product. */
  marketRef?: string;
  /** Event-specific extras (side, ytBurn, payout, etc.). */
  txMeta?: Record<string, unknown>;
};

export const ActivityItemSchema = z.object({
  id: z.string(),
  kind: ActivityKindSchema,
  title: z.string(),
  amount: z.string(),
  time: z.number(),
  productAddr: z.string(),
  marketRef: z.string().optional(),
  txMeta: z.record(z.unknown()).optional(),
});

// ─── Portfolio chart ─────────────────────────────────────────────────────────

export type ChartPoint = {
  /** UTC calendar date bucket, "YYYY-MM-DD". */
  date: string;
  /** Unix seconds of bucket start (00:00 UTC), as BigInt string. */
  ts: string;
  /** Total portfolio value at end of day, USDC 6dp, BigInt string. */
  value: string;
};

export const ChartPointSchema = z.object({
  date: z.string(),
  ts: z.string(),
  value: z.string(),
});

// ─── Portfolio breakdown ─────────────────────────────────────────────────────

export type PortfolioBreakdown = {
  /** Vault principal across all vaults, USDC 6dp, BigInt string. */
  vaultPrincipal: string;
  /** Total accrued vault yield not yet redeemed, USDC 6dp, BigInt string. */
  vaultClaimableYield: string;
  /** YT not locked in any product, USDC 6dp, BigInt string. */
  freeYt: string;
  /** Mark-to-market value of open CPF bets, USDC 6dp, BigInt string. */
  cpfOpen: string;
  /** Resolved CPF winnings awaiting claim, USDC 6dp, BigInt string. */
  cpfClaimable: string;
  /** RYD principal currently locked, USDC 6dp, BigInt string. */
  rydLocked: string;
  /** RYD prizes awaiting claim, USDC 6dp, BigInt string. */
  rydClaimable: string;
  /** TwoPool principal locked, USDC 6dp, BigInt string. */
  twoPoolLocked: string;
  /** TwoPool yield tokens awaiting claim, USDC 6dp, BigInt string. */
  twoPoolClaimable: string;
};

export const PortfolioBreakdownSchema = z.object({
  vaultPrincipal: z.string(),
  vaultClaimableYield: z.string(),
  freeYt: z.string(),
  cpfOpen: z.string(),
  cpfClaimable: z.string(),
  rydLocked: z.string(),
  rydClaimable: z.string(),
  twoPoolLocked: z.string(),
  twoPoolClaimable: z.string(),
});

// ─── Root response ───────────────────────────────────────────────────────────

export type HistoryResponse = {
  /** EIP-55 checksummed wallet address. */
  userAddress: string;

  /** Last block fully processed by the sync orchestrator, as BigInt string. */
  syncedAtBlock: string;
  /** Envio chain head at the time of sync, as BigInt string. */
  envioLatestBlock: string;
  /** True when the response was served from cache without a fresh Envio call. */
  cacheHit: boolean;
  /**
   * Monotonic integer. When this differs from `CURRENT_SCHEMA_VERSION` the
   * orchestrator will discard the cache row and recompute from block 0.
   */
  schemaVersion: number;

  portfolio: {
    /** Sum of all position values, USDC 6dp, BigInt string. */
    totalValueUsdc: string;
    breakdown: PortfolioBreakdown;
    positions: {
      vaults: VaultPosition[];
      ryds: RydPosition[];
      cpfBets: CpfPosition[];
      twoPools: TwoPoolPosition[];
    };
  };

  /** Portfolio value over time — oldest to newest, max 90 daily buckets. */
  chart: ChartPoint[];

  /** Activity feed — newest first, max 100 items per page. */
  activity: ActivityItem[];

  meta: {
    /** Total wall-clock time for the sync + serialise pass, in milliseconds. */
    durationMs: number;
    /** Number of Envio blocks processed in this sync cycle. */
    blocksProcessed: number;
    /** Version of the mapper functions used to compute this response. */
    mapperVersion: number;
  };
};

export const HistoryResponseSchema = z.object({
  userAddress: z.string(),
  syncedAtBlock: z.string(),
  envioLatestBlock: z.string(),
  cacheHit: z.boolean(),
  schemaVersion: z.number().int(),
  portfolio: z.object({
    totalValueUsdc: z.string(),
    breakdown: PortfolioBreakdownSchema,
    positions: z.object({
      vaults: z.array(VaultPositionSchema),
      ryds: z.array(RydPositionSchema),
      cpfBets: z.array(CpfPositionSchema),
      twoPools: z.array(TwoPoolPositionSchema),
    }),
  }),
  chart: z.array(ChartPointSchema),
  activity: z.array(ActivityItemSchema),
  meta: z.object({
    durationMs: z.number(),
    blocksProcessed: z.number().int(),
    mapperVersion: z.number().int(),
  }),
});

// ─── Error shape ─────────────────────────────────────────────────────────────

export type HistoryError = {
  error: string;
  /**
   * Present when a cached response exists but Envio is unreachable.
   * The API returns HTTP 200 with this field set; the UI should show a
   * "may be outdated" banner rather than an error state.
   */
  stale?: {
    /** ISO 8601 datetime of the last successful sync. */
    cachedAt: string;
    /** Block number synced at last successful run, as BigInt string. */
    syncedAtBlock: string;
  };
};

export const HistoryErrorSchema = z.object({
  error: z.string(),
  stale: z
    .object({
      cachedAt: z.string(),
      syncedAtBlock: z.string(),
    })
    .optional(),
});

// ─── Request parameters ──────────────────────────────────────────────────────

export type HistoryQueryParams = {
  /**
   * Cursor for activity pagination. Pass the `id` of the oldest `ActivityItem`
   * from the previous page to fetch the next batch (newest-first, max 100).
   */
  before?: string;
};

export const HistoryQueryParamsSchema = z.object({
  before: z.string().optional(),
});

// ─── Mapper output ───────────────────────────────────────────────────────────

/**
 * Canonical activity record produced by activity mappers.
 * Shape mirrors the UserActivity Prisma model so it can be directly upserted.
 * Intentionally named differently from the Prisma model to avoid import conflicts.
 */
export type ActivityRecord = {
  /** Envio event id with the chain prefix stripped: `${paddedBlock}_${paddedLogIndex}`. */
  id: string;
  /** EIP-55 checksummed wallet address. */
  userAddress: string;
  kind: ActivityKind;
  /** Product contract address (EIP-55 checksummed). */
  productAddr: string;
  marketRef?: string | null;
  /** Signed USDC amount, 6dp, BigInt string. Positive = inflow, negative = outflow. */
  amountDelta: string;
  blockNumber: bigint;
  /** Unix seconds derived from block number (approx for Base; update to real timestamp when available). */
  blockTime: bigint;
  /** Event-specific extras for display and debugging. */
  metadataJson: Record<string, unknown>;
};
import type { BalanceCurrencyKey } from "@/shared/types/balances";

/** Action kinds shown on the global actions history screen. */
export type HistoryEventType =
  | "DEPOSIT"
  | "EARN"
  | "WITHDRAW"
  | "PREDICTION"
  | "PREDICTION_WINNING_CLAIM";

/** Time window for the history list (same spans as balance chart filters, separate constant array). */
export type HistoryTimeFilter = "1D" | "3D" | "7D" | "1M" | "1Y";

export interface HistoryEvent {
  id: string;
  /** Unix ms — used for sorting and interval filtering. */
  timestamp: number;
  type: HistoryEventType;
  /** Signed display value (e.g. -500, +100). */
  amount: number;
  /** Which balance-line icon to show in the amount pill (`BALANCE_CURRENCY_META`). */
  amountCurrency: BalanceCurrencyKey;
}
