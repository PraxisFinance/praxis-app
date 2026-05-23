import { describe, it, expect } from "vitest";
import { toUtcDateBucket, toBucketTs, carryForwardFill } from "../chartHelpers";

// ─── toUtcDateBucket ──────────────────────────────────────────────────────────

describe("toUtcDateBucket", () => {
  it("converts a UTC midnight epoch to YYYY-MM-DD", () => {
    // 2024-01-15 00:00:00 UTC = 1705276800000 ms
    const ms = new Date("2024-01-15T00:00:00Z").getTime();
    expect(toUtcDateBucket(ms)).toBe("2024-01-15");
  });

  it("uses UTC date, not local date", () => {
    // 2024-01-15 23:30:00 UTC is still 2024-01-15 UTC
    const ms = new Date("2024-01-15T23:30:00Z").getTime();
    expect(toUtcDateBucket(ms)).toBe("2024-01-15");
  });
});

// ─── toBucketTs ───────────────────────────────────────────────────────────────

describe("toBucketTs", () => {
  it("returns unix seconds for 00:00 UTC", () => {
    const ts = toBucketTs("2024-01-15");
    const expected = BigInt(new Date("2024-01-15T00:00:00Z").getTime() / 1000);
    expect(ts).toBe(expected);
  });

  it("round-trips with toUtcDateBucket", () => {
    const date = "2025-06-01";
    const ts = toBucketTs(date);
    const roundTripped = toUtcDateBucket(Number(ts) * 1000);
    expect(roundTripped).toBe(date);
  });
});

// ─── carryForwardFill ─────────────────────────────────────────────────────────

describe("carryForwardFill", () => {
  it("returns empty array when fromDate is null (cold start)", () => {
    expect(carryForwardFill(null, "2025-01-10", "1000000")).toEqual([]);
  });

  it("returns empty array when fromDate equals toDate (no gap)", () => {
    expect(carryForwardFill("2025-01-10", "2025-01-10", "1000000")).toEqual([]);
  });

  it("returns empty array when fromDate is after toDate", () => {
    expect(carryForwardFill("2025-01-11", "2025-01-10", "1000000")).toEqual([]);
  });

  it("fills exactly one row for a 1-day gap", () => {
    const rows = carryForwardFill("2025-01-10", "2025-01-11", "1000000");
    expect(rows).toHaveLength(1);
    expect(rows[0]!.bucketDate).toBe("2025-01-11");
    expect(rows[0]!.totalValue).toBe("1000000");
  });

  it("fills correct dates across a 30-day gap", () => {
    const rows = carryForwardFill("2025-01-01", "2025-01-31", "2000000");
    // Exclusive start: 2025-01-02 … inclusive end: 2025-01-31 = 30 rows
    expect(rows).toHaveLength(30);
    expect(rows[0]!.bucketDate).toBe("2025-01-02");
    expect(rows[29]!.bucketDate).toBe("2025-01-31");
    rows.forEach((r) => expect(r.totalValue).toBe("2000000"));
  });

  it("caps at 365 rows when gap > 365 days", () => {
    const rows = carryForwardFill("2022-01-01", "2025-01-01", "500000");
    expect(rows).toHaveLength(365);
    // Should keep the MOST RECENT 365 rows (end of the range)
    expect(rows[364]!.bucketDate).toBe("2025-01-01");
  });

  it("fills exactly 365 rows for a gap of exactly 365 days", () => {
    // 2023-01-01 → 2024-01-01 is exactly 365 days (2023 is not a leap year).
    const rows = carryForwardFill("2023-01-01", "2024-01-01", "500000");
    expect(rows).toHaveLength(365);
    expect(rows[0]!.bucketDate).toBe("2023-01-02");
    expect(rows[364]!.bucketDate).toBe("2024-01-01");
  });

  it("each row has a monotonically increasing bucketTs", () => {
    const rows = carryForwardFill("2025-01-01", "2025-01-10", "100");
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.bucketTs).toBeGreaterThan(rows[i - 1]!.bucketTs);
    }
  });

  it("bucketTs matches toBucketTs for each date", () => {
    const rows = carryForwardFill("2025-03-01", "2025-03-05", "0");
    rows.forEach((r) => {
      expect(r.bucketTs).toBe(toBucketTs(r.bucketDate));
    });
  });
});
