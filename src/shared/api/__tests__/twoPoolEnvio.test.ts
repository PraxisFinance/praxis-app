import { describe, expect, it } from "vitest";
import { mapRawTwoPoolStateToTwoPool, type RawTwoPoolState } from "@/shared/api/twoPoolEnvio";
import { TWO_POOL_NOT_DEFINED_NUM } from "@/shared/constants/twoPoolSentinels";

const RATE_SCALE = 1_000_000_000_000_000_000n;

function makeRaw(overrides: Partial<RawTwoPoolState> = {}): RawTwoPoolState {
  return {
    id: "0xpool",
    state: "Open",
    stableReserve: "7000000",
    elevatedReserve: "3000000",
    targetRate: String(RATE_SCALE / 20n), // 5%
    buffer: String(RATE_SCALE / 100n), // 1%
    feePercentage: "50", // 0.5%
    stablePrice: String(RATE_SCALE / 2n), // neutral
    actualRate: "0",
    startTime: "1700000000",
    endTime: "1800000000",
    resolvedAt: "0",
    lastUpdatedAt: "1700000001",
    ...overrides,
  };
}

describe("mapRawTwoPoolStateToTwoPool", () => {
  it("maps reserves to pool split and TVL label", () => {
    const pool = mapRawTwoPoolStateToTwoPool(makeRaw());
    expect(pool.stablePoolPercent).toBe(70);
    expect(pool.elevatedPoolPercent).toBe(30);
    expect(pool.tvlLabel).toMatch(/\$10/);
  });

  it("maps endTime to endsAt", () => {
    const pool = mapRawTwoPoolStateToTwoPool(makeRaw({ endTime: "1800000000" }));
    expect(pool.endsAt).toBe(new Date(1_800_000_000 * 1000).toISOString());
  });

  it("maps targetRate WAD and fee BPS", () => {
    const pool = mapRawTwoPoolStateToTwoPool(makeRaw());
    expect(pool.targetApyPercent).toBe(5);
    expect(pool.stableEntranceFeePercent).toBe(0.5);
    expect(pool.elevatedEntranceFeePercent).toBe(0.5);
  });

  it("leaves actualRate as sentinel when zero", () => {
    const pool = mapRawTwoPoolStateToTwoPool(makeRaw({ actualRate: "0" }));
    expect(pool.actualRateRaw).not.toBe("0");
    expect(pool.targetApyPercent).not.toBe(TWO_POOL_NOT_DEFINED_NUM);
  });

  it("maps realized actualRate to percent string", () => {
    const pool = mapRawTwoPoolStateToTwoPool(
      makeRaw({ actualRate: String((RATE_SCALE * 3n) / 100n) }) // 3%
    );
    expect(pool.actualRateRaw).toBe("3");
  });
});
