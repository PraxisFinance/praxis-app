/**
 * Pure valuation functions for the historical portfolio curve.
 *
 * `valuateDay` converts a `HistoricalUserState` snapshot (after all events
 * up to the end of a calendar day have been applied) into a USDC 6dp bigint
 * total portfolio value.
 *
 * Valuation rules per product
 * ───────────────────────────
 *  Vault       principal is face-value USDC — no conversion needed.
 *
 *  CPF (open)  cost basis: stake × ytPrice. Reflects the USDC equivalent
 *              of the YT the user locked in.
 *  CPF (resolved, won)
 *              proportional payout = stake / totalWinningStake × totalPool.
 *              Expressed in YT → converted to USDC via ytPrice.
 *  CPF (resolved, lost)  0.
 *  CPF (void/cancelled)  stake returned at ytPrice.
 *
 *  RYD (open)  stake × ytPrice.
 *  RYD (draw done, no RYD_CLAIM event)
 *              0 — user lost (winners are removed from state on RYD_CLAIM).
 *
 *  TwoPool     netDeposited × ytPrice.
 */

import type { RawCPFPoolState, RawRYDState } from "@/shared/types/envioRaw";
import { toUtcDateBucket } from "./chartHelpers";
import type { HistoricalUserState } from "./historicalState";
import type { RedeemYieldEvent } from "./ytPrice";
import { getYtPriceOnDate } from "./ytPrice";

// ── Internal helpers ──────────────────────────────────────────────────────────

function mulDiv(a: bigint, b: bigint, c: bigint): bigint {
  if (c === 0n) return 0n;
  return (a * b) / c;
}

/** Convert YT amount (6dp) to USDC (6dp) using the given ytPrice (6dp). */
function ytToUsdc(ytAmount: bigint, ytPrice: bigint): bigint {
  return mulDiv(ytAmount, ytPrice, 1_000_000n);
}

/**
 * USDC value of one CPF position on `date`.
 *
 * Uses the current (post-resolution) CPFPoolState to determine the outcome.
 * For open pools, returns cost basis (stake × ytPrice). For resolved pools,
 * returns the proportional payout (in YT → USDC) for winners, 0 for losers.
 */
function valueCpfPosition(
  stake: bigint,
  isForSide: boolean,
  poolState: RawCPFPoolState,
  date: string,
  ytPrice: bigint,
): bigint {
  if (stake === 0n) return 0n;

  const stateUpper = poolState.state.toUpperCase();

  // Voided or cancelled — stake will be (or has been) fully refunded.
  if (stateUpper.includes("VOID") || stateUpper.includes("CANCEL")) {
    return ytToUsdc(stake, ytPrice);
  }

  // Not yet resolved on this date → cost basis.
  // Gate on state field; Envio may emit a non-empty winningOutcome default for open pools.
  const resolvedAt = BigInt(poolState.resolvedAt ?? "0");
  const isResolved = poolState.state.toUpperCase() === "RESOLVED" && resolvedAt > 0n;
  if (!isResolved || toUtcDateBucket(Number(resolvedAt) * 1000) > date) {
    return ytToUsdc(stake, ytPrice);
  }

  // Resolved — determine winner side.
  // Outcome encoding: "0" / "FOR" / "YES" / "TRUE" = FOR won;
  //                   "1" / "AGAINST" / "NO" / "FALSE" = AGAINST won.
  const outcome = poolState.winningOutcome.toUpperCase();
  const forWon =
    outcome === "FOR" || outcome === "YES" || outcome === "TRUE" || outcome === "0";
  const userWon = isForSide ? forWon : !forWon;

  if (!userWon) return 0n;

  // Payout (in YT) = stake / totalWinningStake × (totalWinningStake + totalLosingStake)
  const totalWinning = BigInt(poolState.totalWinningStake);
  const totalPool = totalWinning + BigInt(poolState.totalLosingStake);
  if (totalWinning === 0n) return 0n;

  const payoutYt = mulDiv(stake, totalPool, totalWinning);
  return ytToUsdc(payoutYt, ytPrice);
}

/**
 * USDC value of one RYD position on `date`.
 *
 * If the draw has not yet finished, returns stake × ytPrice. If the draw is
 * done and there is no RYD_CLAIM event for this user (position is still in
 * state), the user lost → 0.
 *
 * Note: winners who have not yet claimed are also shown as 0 until their
 * RYD_CLAIM event fires and is replayed. This is a known v1 limitation.
 */
function valueRydPosition(
  stake: bigint,
  rydState: RawRYDState | undefined,
  date: string,
  ytPrice: bigint,
): bigint {
  if (stake === 0n) return 0n;

  if (!rydState || rydState.finishedAt === "0") {
    return ytToUsdc(stake, ytPrice);
  }

  const finishedDate = toUtcDateBucket(Number(rydState.finishedAt) * 1000);
  if (date < finishedDate) {
    return ytToUsdc(stake, ytPrice);
  }

  // Draw finished and no claim event — user lost.
  return 0n;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Compute the total USDC portfolio value (6dp bigint) from the given
 * historical state snapshot, as of the end of `date`.
 *
 * @param state         Historical state after all events up to end of `date`.
 * @param date          UTC date bucket "YYYY-MM-DD".
 * @param cpfByMarketRef  Map from "${cpfAddr}:${poolId}" to CPFPoolState.
 * @param rydById       Map from ryd contract address to RYDState.
 * @param redeemEvents  VAULT_REDEEM_YIELD events for ytPrice derivation
 *                      (same reference as state.redeemEvents — passed
 *                      explicitly so the function stays pure).
 */
export function valuateDay(
  state: HistoricalUserState,
  date: string,
  cpfByMarketRef: ReadonlyMap<string, RawCPFPoolState>,
  rydById: ReadonlyMap<string, RawRYDState>,
  redeemEvents: readonly RedeemYieldEvent[],
): bigint {
  const ytPrice = getYtPriceOnDate(redeemEvents, date);

  let total = 0n;

  // 1. Vault principal — USDC, face value.
  for (const principal of state.vaultPrincipal.values()) {
    total += principal;
  }

  // 2. CPF positions.
  for (const [ref, pos] of state.cpfPositions) {
    const poolState = cpfByMarketRef.get(ref);
    if (!poolState) {
      // Pool not in global state (shouldn't happen in practice); use cost basis.
      total += ytToUsdc(pos.stake, ytPrice);
      continue;
    }
    total += valueCpfPosition(pos.stake, pos.isForSide, poolState, date, ytPrice);
  }

  // 3. RYD positions.
  for (const [ref, pos] of state.rydPositions) {
    const rydState = rydById.get(ref);
    total += valueRydPosition(pos.stake, rydState, date, ytPrice);
  }

  // 4. TwoPool positions — net YT locked at ytPrice.
  for (const netDeposited of state.twoPoolPos.values()) {
    total += ytToUsdc(netDeposited, ytPrice);
  }

  return total;
}
