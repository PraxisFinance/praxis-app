import type { CryptoPredictionStatus } from "@/shared/types/cryptoPrediction";

export type TwoPoolSide = "stable" | "elevated";

/**
 * Two-pool yield product. Fields not present on `TwoPoolState` use
 * `TWO_POOL_NOT_DEFINED_STR` / `TWO_POOL_NOT_DEFINED_NUM` from `@/shared/constants/twoPoolSentinels`
 * — never `undefined`.
 */
export type TwoPool = {
  id: string;
  title: string;
  assetSymbol: string;
  iconUrl: string;
  status: CryptoPredictionStatus;
  endsAt: string;
  isTradingOpen: boolean;
  /** Deploy-time target APY %, or -1 if not on indexer */
  targetApyPercent: number;
  /** Model / predicted APY %, or -1 if not on indexer */
  predictedApyPercent: number;
  /** Share of TVL on stable side (0–100), derived from `sideTVLStable` / `sideTVLElevated` */
  stablePoolPercent: number;
  /** Share of TVL on elevated side (0–100) */
  elevatedPoolPercent: number;
  /** Entrance fee % of deposit (stable), or -1 if not on indexer */
  stableEntranceFeePercent: number;
  /** Entrance fee % of deposit (elevated), or -1 if not on indexer */
  elevatedEntranceFeePercent: number;
  /** Raw `actualRate` from indexer, or "Not defined" if absent */
  actualRateRaw: string;
  /** What the indexer row could not supply or only approximated */
  indexerGaps: readonly string[];
};
