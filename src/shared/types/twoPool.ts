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
  /** Formatted total TVL (`stableReserve` + `elevatedReserve`), or "Not defined" */
  tvlLabel: string;
  /** Deploy-time target APY % from `targetRate` (1e18 = 100%), or -1 if unset */
  targetApyPercent: number;
  /** Market-implied APY % from reserves/`stablePrice`, or -1 if unset */
  predictedApyPercent: number;
  /** Share of TVL on stable side (0–100), derived from `stableReserve` / `elevatedReserve` */
  stablePoolPercent: number;
  /** Share of TVL on elevated side (0–100) */
  elevatedPoolPercent: number;
  /** Entrance fee % of deposit (stable), from pool `feePercentage` BPS, or -1 if unset */
  stableEntranceFeePercent: number;
  /** Entrance fee % of deposit (elevated), from pool `feePercentage` BPS, or -1 if unset */
  elevatedEntranceFeePercent: number;
  /** Realized `actualRate` as percent string, or "Not defined" if absent */
  actualRateRaw: string;
  /** Off-chain description from TwoPoolContract postgres row, or null if not seeded */
  description: string | null;
  /** What the indexer row could not supply or only approximated */
  indexerGaps: readonly string[];
  /** Optional hub/detail presentation payload */
  detail?: TwoPoolDetail;
};
