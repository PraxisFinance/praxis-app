import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";

/** Fee schedule row used when quoting the protocol “active” entrance line (predicted vs target). */
export function getActiveFeeScheduleSide(pool: TwoPool): TwoPoolSide {
  return pool.predictedApyPercent > pool.targetApyPercent ? "elevated" : "stable";
}

export function getEntranceFeePercentForSide(pool: TwoPool, side: TwoPoolSide): number {
  return side === "stable" ? pool.stableEntranceFeePercent : pool.elevatedEntranceFeePercent;
}

/** Approximate share of deposit that becomes pool shares after fee, in %. */
export function getNetDepositPercentAfterFee(feePercent: number): number {
  return Math.max(0, 100 - feePercent);
}
