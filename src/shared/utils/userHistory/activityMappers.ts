/**
 * Pure mapper functions: raw Envio event rows → ActivityRecord (DB-ready).
 *
 * Convention:
 *   id          = envioIdToActivityId(raw.id)     — chain prefix stripped
 *   amountDelta = signed USDC string; positive = cash in, negative = cash out
 *     VAULT_DEPOSIT        +principal
 *     VAULT_WITHDRAW       -(amount)   gross, includes yield payout
 *     VAULT_REDEEM_YIELD   +payout
 *     RYD_DEPOSIT          -(amount)   YT locked
 *     RYD_WITHDRAW         +amount
 *     RYD_CLAIM            +amount
 *     CPF_BET              -(amount)   YT spent
 *     CPF_CANCEL           "0"         refund amount not in event
 *     CPF_CLAIM            +payout
 *     CPF_WITHDRAW         +amount
 *     TWOPOOL_DEPOSIT      -(netAmount)
 *     TWOPOOL_CLAIM        "0"         value is YT; stored in metadataJson.ytOut
 */

import { envioIdToActivityId } from "@/shared/api/userHistoryEnvio";
import type { ActivityRecord } from "@/shared/types/history";
import type {
  RawVaultDeposit,
  RawVaultWithdraw,
  RawVaultRedeemYield,
  RawRYDDeposited,
  RawRYDWithdrawn,
  RawRYDPrizeClaimed,
  RawCPFPlaceBet,
  RawCPFCancelBet,
  RawCPFRewardClaimed,
  RawCPFWithdraw,
  RawTwoPoolDeposited,
  RawTwoPoolClaimed,
  UserDeltaResponse,
} from "@/shared/types/envioRaw";

// ─── Block time approximation ────────────────────────────────────────────────

/**
 * Default Base mainnet genesis timestamp (August 9, 2023 ≈ unix 1691539200).
 * Used to approximate block timestamps until we query real `block.timestamp`
 * from Envio (TODO: add blockTimestamp to Q1 query fields).
 */
const DEFAULT_BASE_GENESIS_TS = 1691539200n;
const BASE_BLOCK_SECS = 2n;

function configuredBaseGenesisTs(): bigint {
  const raw = process.env.HISTORY_BASE_GENESIS_TS;
  if (!raw) return DEFAULT_BASE_GENESIS_TS;
  if (!/^\d+$/.test(raw)) {
    throw new Error("HISTORY_BASE_GENESIS_TS must be a unix timestamp in seconds");
  }
  return BigInt(raw);
}

function blockInfoFromId(envioId: string): { blockNumber: bigint; blockTime: bigint } {
  // envioIdToActivityId strips the chain-prefix regardless of chain id
  // (handles both "8453_…" and "84532_…" without hardcoding the prefix).
  const stripped = envioIdToActivityId(envioId);
  const blockNumber = BigInt(stripped.split("_")[0] ?? "0");
  const blockTime = configuredBaseGenesisTs() + blockNumber * BASE_BLOCK_SECS;
  return { blockNumber, blockTime };
}

// ─── Vault ───────────────────────────────────────────────────────────────────

export function mapVaultDepositActivity(
  raw: RawVaultDeposit,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "VAULT_DEPOSIT",
    productAddr: raw.vault,
    marketRef: raw.vault,
    amountDelta: raw.principal,
    blockNumber,
    blockTime,
    metadataJson: { vault: raw.vault, principal: raw.principal, buyIn: raw.buyIn },
  };
}

export function mapVaultWithdrawActivity(
  raw: RawVaultWithdraw,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "VAULT_WITHDRAW",
    productAddr: raw.vault,
    marketRef: raw.vault,
    amountDelta: `-${raw.amount}`,
    blockNumber,
    blockTime,
    metadataJson: { vault: raw.vault, amount: raw.amount, yieldPayout: raw.yieldPayout },
  };
}

export function mapVaultRedeemActivity(
  raw: RawVaultRedeemYield,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "VAULT_REDEEM_YIELD",
    productAddr: raw.vault,
    marketRef: raw.vault,
    amountDelta: raw.payout,
    blockNumber,
    blockTime,
    metadataJson: { vault: raw.vault, ytBurn: raw.ytBurn, payout: raw.payout },
  };
}

// ─── RYD ─────────────────────────────────────────────────────────────────────

export function mapRydDepositActivity(
  raw: RawRYDDeposited,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "RYD_DEPOSIT",
    productAddr: raw.ryd,
    marketRef: raw.ryd,
    amountDelta: `-${raw.amount}`,
    blockNumber,
    blockTime,
    metadataJson: { ryd: raw.ryd, amount: raw.amount },
  };
}

export function mapRydWithdrawActivity(
  raw: RawRYDWithdrawn,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "RYD_WITHDRAW",
    productAddr: raw.ryd,
    marketRef: raw.ryd,
    amountDelta: raw.amount,
    blockNumber,
    blockTime,
    metadataJson: { ryd: raw.ryd, amount: raw.amount },
  };
}

export function mapRydClaimActivity(
  raw: RawRYDPrizeClaimed,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "RYD_CLAIM",
    productAddr: raw.ryd,
    marketRef: raw.ryd,
    amountDelta: raw.amount,
    blockNumber,
    blockTime,
    metadataJson: { ryd: raw.ryd, amount: raw.amount },
  };
}

// ─── CPF ─────────────────────────────────────────────────────────────────────

export function mapCpfBetActivity(
  raw: RawCPFPlaceBet,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "CPF_BET",
    productAddr: raw.cpf,
    marketRef: `${raw.cpf}_${raw.poolId}`,
    amountDelta: `-${raw.amount}`,
    blockNumber,
    blockTime,
    metadataJson: {
      cpf: raw.cpf,
      poolId: raw.poolId,
      amount: raw.amount,
      side: raw.inFavor ? "FOR" : "AGAINST",
    },
  };
}

export function mapCpfCancelActivity(
  raw: RawCPFCancelBet,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "CPF_CANCEL",
    productAddr: raw.cpf,
    marketRef: `${raw.cpf}_${raw.poolId}`,
    // CancelBet event does not carry the refunded amount on-chain.
    amountDelta: "0",
    blockNumber,
    blockTime,
    metadataJson: { cpf: raw.cpf, poolId: raw.poolId },
  };
}

export function mapCpfClaimActivity(
  raw: RawCPFRewardClaimed,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "CPF_CLAIM",
    productAddr: raw.cpf,
    marketRef: `${raw.cpf}_${raw.poolId}`,
    amountDelta: raw.payout,
    blockNumber,
    blockTime,
    metadataJson: { cpf: raw.cpf, poolId: raw.poolId, payout: raw.payout },
  };
}

export function mapCpfWithdrawActivity(
  raw: RawCPFWithdraw,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "CPF_WITHDRAW",
    productAddr: raw.cpf,
    // CancelBet/Withdraw events don't carry poolId; can't derive marketRef.
    marketRef: null,
    amountDelta: raw.amount,
    blockNumber,
    blockTime,
    metadataJson: { cpf: raw.cpf, amount: raw.amount },
  };
}

// ─── TwoPool ─────────────────────────────────────────────────────────────────

/** Convert the on-chain side integer (0 = STABLE, 1 = ELEVATED) to a label. */
function twoPoolSideLabel(side: number): "STABLE" | "ELEVATED" {
  return side === 1 ? "ELEVATED" : "STABLE";
}

export function mapTwoPoolDepositActivity(
  raw: RawTwoPoolDeposited,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "TWOPOOL_DEPOSIT",
    productAddr: raw.pool,
    marketRef: raw.pool,
    amountDelta: `-${raw.netAmount}`,
    blockNumber,
    blockTime,
    metadataJson: {
      pool: raw.pool,
      side: twoPoolSideLabel(raw.side),
      grossAmount: raw.grossAmount,
      fee: raw.fee,
      netAmount: raw.netAmount,
    },
  };
}

export function mapTwoPoolClaimActivity(
  raw: RawTwoPoolClaimed,
  userAddress: string,
): ActivityRecord {
  const { blockNumber, blockTime } = blockInfoFromId(raw.id);
  return {
    id: envioIdToActivityId(raw.id),
    userAddress,
    kind: "TWOPOOL_CLAIM",
    productAddr: raw.pool,
    marketRef: raw.pool,
    // YT out — not a USDC amount; USDC equivalent tracked via positions
    amountDelta: "0",
    blockNumber,
    blockTime,
    metadataJson: { pool: raw.pool, side: twoPoolSideLabel(raw.side), ytOut: raw.ytOut },
  };
}

// ─── Batch helper ─────────────────────────────────────────────────────────────

/**
 * Map all 12 event arrays from a UserDeltaResponse to ActivityRecord rows,
 * sorted newest-first by blockTime.
 */
export function mapAllDeltaToActivities(
  delta: UserDeltaResponse,
  userAddress: string,
): ActivityRecord[] {
  const rows: ActivityRecord[] = [
    ...delta.PraxisVault_Deposit.map((e) => mapVaultDepositActivity(e, userAddress)),
    ...delta.PraxisVault_Withdraw.map((e) => mapVaultWithdrawActivity(e, userAddress)),
    ...delta.PraxisVault_RedeemYield.map((e) => mapVaultRedeemActivity(e, userAddress)),
    ...delta.PraxisRYD_Deposited.map((e) => mapRydDepositActivity(e, userAddress)),
    ...delta.PraxisRYD_Withdrawn.map((e) => mapRydWithdrawActivity(e, userAddress)),
    ...delta.PraxisRYD_PrizeClaimed.map((e) => mapRydClaimActivity(e, userAddress)),
    ...delta.PraxisCPF_PlaceBet.map((e) => mapCpfBetActivity(e, userAddress)),
    ...delta.PraxisCPF_CancelBet.map((e) => mapCpfCancelActivity(e, userAddress)),
    ...delta.PraxisCPF_RewardClaimed.map((e) => mapCpfClaimActivity(e, userAddress)),
    ...delta.PraxisCPF_Withdraw.map((e) => mapCpfWithdrawActivity(e, userAddress)),
    ...delta.PraxisTwoPool_Deposited.map((e) => mapTwoPoolDepositActivity(e, userAddress)),
    ...delta.PraxisTwoPool_Claimed.map((e) => mapTwoPoolClaimActivity(e, userAddress)),
  ];

  // Newest first for consistent ordering before DB upsert
  rows.sort((a, b) => (b.blockTime > a.blockTime ? 1 : b.blockTime < a.blockTime ? -1 : 0));
  return rows;
}
