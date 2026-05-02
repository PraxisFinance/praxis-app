import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";

/** Fee schedule row when predicted vs target APY is known; otherwise stable. */
export function getActiveFeeScheduleSide(pool: TwoPool): TwoPoolSide {
  const t = pool.targetApyPercent;
  const p = pool.predictedApyPercent;
  if (t == null || p == null) return "stable";
  return p > t ? "elevated" : "stable";
}

export function getEntranceFeePercentForSide(pool: TwoPool, side: TwoPoolSide): number {
  return side === "stable" ? pool.stableEntranceFeePercent : pool.elevatedEntranceFeePercent;
}

/** Approximate share of deposit that becomes pool shares after fee, in %. */
export function getNetDepositPercentAfterFee(feePercent: number): number {
  return Math.max(0, 100 - feePercent);
}
