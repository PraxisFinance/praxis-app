/**
 * YT→USDC price derivation from VAULT_REDEEM_YIELD events.
 *
 * Each RedeemYield event records `ytBurn` (YT tokens burned, 6dp) and
 * `payout` (USDC received, 6dp). Their ratio gives the exact conversion
 * rate at that moment. Between events we carry the most recent rate forward;
 * before any event we default to 1.0 (1 USDC per YT).
 */

export type RedeemYieldEvent = {
  /** Unix seconds (BigInt). */
  blockTime: bigint;
  /** YT tokens burned — USDC 6dp BigInt string. */
  ytBurn: string;
  /** USDC received — USDC 6dp BigInt string. */
  payout: string;
};

/**
 * Returns the YT→USDC price on the given UTC date bucket, expressed in
 * USDC 6dp (e.g. 1_050_000n = 1.05 USDC per 1 YT).
 *
 * Algorithm: finds the latest RedeemYield event whose blockTime falls on or
 * before the end of `date`, then returns `payout * 1_000_000 / ytBurn`.
 * Defaults to 1_000_000n (1.0 USDC) when no prior redemption exists.
 */
export function getYtPriceOnDate(
  redeemEvents: readonly RedeemYieldEvent[],
  date: string, // "YYYY-MM-DD"
): bigint {
  const endOfDayMs = new Date(date + "T23:59:59Z").getTime();
  const endOfDaySec = BigInt(Math.floor(endOfDayMs / 1000));

  let bestTs = -1n;
  let bestEvent: RedeemYieldEvent | null = null;

  for (const ev of redeemEvents) {
    if (ev.blockTime <= endOfDaySec && ev.blockTime > bestTs) {
      bestTs = ev.blockTime;
      bestEvent = ev;
    }
  }

  if (!bestEvent) return 1_000_000n;

  const ytBurn = BigInt(bestEvent.ytBurn);
  const payout = BigInt(bestEvent.payout);

  if (ytBurn === 0n) return 1_000_000n;

  // price (6dp) = payout * 1_000_000 / ytBurn
  // Both operands are already 6dp, so the result is also 6dp.
  return (payout * 1_000_000n) / ytBurn;
}
