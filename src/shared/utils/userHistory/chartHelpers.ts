/**
 * Pure date-bucket utilities for the portfolio chart.
 * No I/O, no side effects — fully unit-testable.
 */

export type PortfolioPointRow = {
  bucketDate: string;
  bucketTs: bigint;
  totalValue: string;
  breakdownJson: Record<string, unknown>;
};

/**
 * Convert a millisecond epoch timestamp to a UTC calendar date string.
 * @returns "YYYY-MM-DD"
 */
export function toUtcDateBucket(epochMs: number): string {
  return new Date(epochMs).toISOString().slice(0, 10);
}

/**
 * Return the unix timestamp (seconds) for 00:00:00 UTC on the given date.
 * @param date "YYYY-MM-DD"
 */
export function toBucketTs(date: string): bigint {
  return BigInt(Math.floor(new Date(date + "T00:00:00Z").getTime() / 1000));
}

/** Maximum number of carry-forward rows to emit (prevents unbounded DB writes). */
export const MAX_FILL_DAYS = 365;

/**
 * Generate carry-forward fill rows for every calendar day in the half-open
 * interval (fromDate, toDate].  All rows inherit `lastValue`.
 *
 * When the gap exceeds MAX_FILL_DAYS, only the most recent MAX_FILL_DAYS rows
 * are returned (oldest are dropped).
 *
 * @param fromDate  Exclusive start — the date already written (or null on first sync).
 * @param toDate    Inclusive end — typically today's date.
 * @param lastValue USDC 6dp BigInt string to carry forward.
 */
export function carryForwardFill(
  fromDate: string | null,
  toDate: string,
  lastValue: string,
): PortfolioPointRow[] {
  if (!fromDate) return [];

  const startExclusive = new Date(fromDate + "T00:00:00Z");
  const endInclusive = new Date(toDate + "T00:00:00Z");

  // Nothing to fill if start >= end
  if (startExclusive >= endInclusive) return [];

  const rows: PortfolioPointRow[] = [];
  const cursor = new Date(startExclusive);
  cursor.setUTCDate(cursor.getUTCDate() + 1);

  while (cursor <= endInclusive) {
    const bucketDate = cursor.toISOString().slice(0, 10);
    rows.push({
      bucketDate,
      bucketTs: toBucketTs(bucketDate),
      totalValue: lastValue,
      breakdownJson: {},
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  // Cap to the most recent MAX_FILL_DAYS rows to prevent unbounded DB writes.
  return rows.length > MAX_FILL_DAYS ? rows.slice(-MAX_FILL_DAYS) : rows;
}
