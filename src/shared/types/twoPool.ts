import type { CryptoPredictionStatus } from "@/shared/types/cryptoPrediction";

export type TwoPoolSide = "stable" | "elevated";

export type TwoPoolApyChartPoint = {
  timeLabel: string;
  apyPercent: number;
};

/** Detail-screen extras (chart + resolution + drawer copy). Not required on indexer-mapped rows. */
export type TwoPoolDetail = {
  chartPoints: TwoPoolApyChartPoint[];
  resolutionParagraphs: string[];
  /** Underlying vault / pool label shown in the deposit drawer */
  underlyingPoolName: string;
  yourDepositYtLabel: string;
  averageYieldYtLabel: string;
  slippagePercent: number;
  poolLifetimeLabel: string;
  /** Amount string fed into deposit (e.g. "1000") */
  depositAmountInput: string;
  performanceTargetApyPercent: number;
  performanceRealApyPercents: readonly number[];
  performanceReceivePercents: readonly number[];
};

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
  /** Formatted total TVL (`sideTVLStable` + `sideTVLElevated`), or "Not defined" */
  tvlLabel: string;
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
  /** Off-chain description from TwoPoolContract postgres row, or null if not seeded */
  description: string | null;
  /** What the indexer row could not supply or only approximated */
  indexerGaps: readonly string[];
  /** Optional hub/detail presentation payload */
  detail?: TwoPoolDetail;
};
