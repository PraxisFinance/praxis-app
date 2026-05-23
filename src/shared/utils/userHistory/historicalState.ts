/**
 * Event-sourced user state machine for the historical portfolio curve.
 *
 * `HistoricalUserState` is a mutable snapshot that is advanced one
 * `ActivityRecord`-shaped event at a time (ascending blockTime). After
 * processing all events up to the end of a calendar day, the state is
 * handed to `historicalValuation.valuateDay` to produce a USDC value.
 *
 * Tracked components
 * ──────────────────
 *  vaultPrincipal  USDC deposited minus withdrawn, per vault.
 *  cpfPositions    Open CPF bets: YT stake + which side.
 *  rydPositions    Open RYD deposits: YT stake.
 *  twoPoolPos      Net YT locked per TwoPool.
 *  redeemEvents    VAULT_REDEEM_YIELD records used by ytPrice.getYtPriceOnDate.
 *
 * NOT tracked (v1 scope)
 * ──────────────────────
 *  Free YT (continuous vault yield accrual — not event-based).
 *  Claimed USDC that left the protocol to the user's wallet.
 */

import type { ActivityKind } from "@/shared/types/history";
import type { RedeemYieldEvent } from "./ytPrice";

// ── Minimal activity shape the state machine needs ────────────────────────────

export type ActivityForState = {
  kind: ActivityKind;
  productAddr: string;
  marketRef?: string | null;
  amountDelta: string;
  blockTime: bigint;
  metadataJson: Record<string, unknown>;
};

// ── Per-product position types ────────────────────────────────────────────────

export type CpfHistoricalPos = {
  /** YT tokens staked, 6dp. */
  stake: bigint;
  /** true = bet FOR the outcome, false = bet AGAINST. */
  isForSide: boolean;
};

export type RydHistoricalPos = {
  /** YT tokens deposited, 6dp. */
  stake: bigint;
};

// ── State ─────────────────────────────────────────────────────────────────────

export interface HistoricalUserState {
  /** Net USDC principal per vault (6dp). Key = productAddr. */
  vaultPrincipal: Map<string, bigint>;
  /** Open CPF bets. Key = marketRef ("${cpfAddr}:${poolId}"). */
  cpfPositions: Map<string, CpfHistoricalPos>;
  /** Open RYD deposits. Key = marketRef (ryd contract address). */
  rydPositions: Map<string, RydHistoricalPos>;
  /** Net YT deposited per TwoPool (6dp). Key = productAddr. */
  twoPoolPos: Map<string, bigint>;
  /** All VAULT_REDEEM_YIELD events seen so far — used to derive YT price. */
  redeemEvents: RedeemYieldEvent[];
}

export function makeHistoricalUserState(): HistoricalUserState {
  return {
    vaultPrincipal: new Map(),
    cpfPositions: new Map(),
    rydPositions: new Map(),
    twoPoolPos: new Map(),
    redeemEvents: [],
  };
}

// ── Event application ─────────────────────────────────────────────────────────

/**
 * Mutates `state` by applying one activity event.
 * Events must arrive in ascending blockTime order.
 */
export function applyEvent(
  state: HistoricalUserState,
  a: ActivityForState,
): void {
  const meta = a.metadataJson;

  switch (a.kind) {
    // ── Vaults ───────────────────────────────────────────────────────────────
    // amountDelta: positive for deposits, negative for withdrawals (USDC, 6dp).

    case "VAULT_DEPOSIT": {
      const prev = state.vaultPrincipal.get(a.productAddr) ?? 0n;
      state.vaultPrincipal.set(a.productAddr, prev + BigInt(a.amountDelta));
      break;
    }
    case "VAULT_WITHDRAW": {
      const prev = state.vaultPrincipal.get(a.productAddr) ?? 0n;
      state.vaultPrincipal.set(a.productAddr, prev + BigInt(a.amountDelta));
      break;
    }
    case "VAULT_REDEEM_YIELD": {
      // Collect for ytPrice derivation; actual amounts in metadataJson.
      const ytBurn = typeof meta.ytBurn === "string" ? meta.ytBurn : "0";
      const payout = typeof meta.payout === "string" ? meta.payout : a.amountDelta;
      if (BigInt(ytBurn) > 0n) {
        state.redeemEvents.push({ blockTime: a.blockTime, ytBurn, payout });
      }
      break;
    }

    // ── CPF ──────────────────────────────────────────────────────────────────
    // CPF_BET amountDelta is negative (YT outflow); the positive stake is in
    // metadataJson.amount.

    case "CPF_BET": {
      // marketRef format: "${cpf}_${poolId}" — must match activityMappers.ts and cpfByMarketRef.
      const ref = a.marketRef ?? `${a.productAddr}_unknown`;
      const rawStake = typeof meta.amount === "string" ? meta.amount : "0";
      const isForSide = meta.side === "FOR";
      state.cpfPositions.set(ref, { stake: BigInt(rawStake), isForSide });
      break;
    }
    case "CPF_CANCEL": {
      const ref = a.marketRef ?? `${a.productAddr}_unknown`;
      state.cpfPositions.delete(ref);
      break;
    }
    case "CPF_CLAIM": {
      const ref = a.marketRef ?? `${a.productAddr}_unknown`;
      state.cpfPositions.delete(ref);
      break;
    }
    case "CPF_WITHDRAW": {
      // Pool was voided/cancelled; marketRef is null — remove all positions
      // for this CPF contract address.
      for (const key of state.cpfPositions.keys()) {
        if (key.startsWith(a.productAddr + "_")) {
          state.cpfPositions.delete(key);
        }
      }
      break;
    }

    // ── RYD ──────────────────────────────────────────────────────────────────
    // RYD_DEPOSIT amountDelta is negative (YT outflow); positive stake in
    // metadataJson.amount.

    case "RYD_DEPOSIT": {
      const ref = a.marketRef ?? a.productAddr;
      const rawStake = typeof meta.amount === "string" ? meta.amount : "0";
      state.rydPositions.set(ref, { stake: BigInt(rawStake) });
      break;
    }
    case "RYD_WITHDRAW": {
      // User withdrew before the draw; YT returned.
      const ref = a.marketRef ?? a.productAddr;
      state.rydPositions.delete(ref);
      break;
    }
    case "RYD_CLAIM": {
      // Winner claimed prize (USDC); remove position.
      const ref = a.marketRef ?? a.productAddr;
      state.rydPositions.delete(ref);
      break;
    }

    // ── TwoPool ──────────────────────────────────────────────────────────────
    // TWOPOOL_DEPOSIT amountDelta is negative (YT outflow); positive net in
    // metadataJson.netAmount.

    case "TWOPOOL_DEPOSIT": {
      const prev = state.twoPoolPos.get(a.productAddr) ?? 0n;
      const rawNet = typeof meta.netAmount === "string" ? meta.netAmount : "0";
      state.twoPoolPos.set(a.productAddr, prev + BigInt(rawNet));
      break;
    }
    case "TWOPOOL_CLAIM": {
      // YT yield claimed back; reduces locked position.
      const prev = state.twoPoolPos.get(a.productAddr) ?? 0n;
      const ytOut = typeof meta.ytOut === "string" ? BigInt(meta.ytOut) : 0n;
      const next = prev - ytOut;
      if (next <= 0n) {
        state.twoPoolPos.delete(a.productAddr);
      } else {
        state.twoPoolPos.set(a.productAddr, next);
      }
      break;
    }
  }
}
