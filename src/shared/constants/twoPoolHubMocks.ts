import { USDC_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { TwoPool, TwoPoolDetail } from "@/shared/types/twoPool";

const TWO_POOL_DETAIL_CHART_POINTS: TwoPoolDetail["chartPoints"] = [
  { timeLabel: "5:20pm", apyPercent: 2.1 },
  { timeLabel: "5:40pm", apyPercent: 3.8 },
  { timeLabel: "6:00pm", apyPercent: 2.4 },
  { timeLabel: "6:20pm", apyPercent: 4.6 },
  { timeLabel: "6:40pm", apyPercent: 3.2 },
  { timeLabel: "7:00pm", apyPercent: 5.0 },
];

const USDC_PREDICTION_DETAIL: TwoPoolDetail = {
  chartPoints: TWO_POOL_DETAIL_CHART_POINTS,
  resolutionParagraphs: [
    'This market will resolve to "Stable" if the realized pool APY at the end of the period is at or below the deploy-time target APY. Otherwise, it will resolve to "Elevated".',
    "Resolution uses the on-chain actual rate observed at the pool close timestamp. Deposits on either side share the period’s yield according to the two-pool allocation rules.",
    "The resolution source is the Praxis TwoPool contract state at close (actualRate / final side allocations).",
  ],
  underlyingPoolName: "Steakhouse USDC",
  yourDepositYtLabel: "1000 USDT",
  averageYieldYtLabel: "50 USDT",
  slippagePercent: 5,
  poolLifetimeLabel: "1d 24h 54m",
  depositAmountInput: "1000",
  performanceTargetApyPercent: 5,
  performanceRealApyPercents: [2, 4, 5, 8, 10],
  performanceReceivePercents: [3.25, 5, 5, 5, 5],
};

const USDC_ELEVATED_SEASON_DETAIL: TwoPoolDetail = {
  chartPoints: [
    { timeLabel: "5:20pm", apyPercent: 1.8 },
    { timeLabel: "5:40pm", apyPercent: 2.6 },
    { timeLabel: "6:00pm", apyPercent: 3.1 },
    { timeLabel: "6:20pm", apyPercent: 2.9 },
    { timeLabel: "6:40pm", apyPercent: 3.7 },
    { timeLabel: "7:00pm", apyPercent: 4.2 },
  ],
  resolutionParagraphs: [
    'This market will resolve to "Elevated" if predicted APY stays above the target APY for the full season window. Otherwise, it will resolve to "Stable".',
    "Final settlement uses the TwoPool resolution allocations published on-chain at season end.",
  ],
  underlyingPoolName: "Steakhouse USDC",
  yourDepositYtLabel: "500 USDT",
  averageYieldYtLabel: "20 USDT",
  slippagePercent: 3,
  poolLifetimeLabel: "3d 12h 00m",
  depositAmountInput: "500",
  performanceTargetApyPercent: 4.2,
  performanceRealApyPercents: [2, 3, 4.2, 6, 8],
  performanceReceivePercents: [2.5, 4, 4.2, 4.2, 4.2],
};

/**
 * Temporary hub fixtures until `useTwoPoolsStore` is populated from the indexer.
 * Shape matches `TwoPool` 1:1 (including card fields like `tvlLabel`).
 */
export const PREDICTIONS_HUB_TWO_POOL_MOCKS: TwoPool[] = [
  {
    id: "hub-two-pool-usdc-1",
    title: "USDC Prediction",
    assetSymbol: "USDC",
    iconUrl: USDC_ICON_URL,
    status: { kind: "live", label: "Live now" },
    endsAt: "2026-02-27T23:59:59.000Z",
    isTradingOpen: true,
    tvlLabel: "$123.514",
    targetApyPercent: 3.1,
    predictedApyPercent: 5,
    stablePoolPercent: 42,
    elevatedPoolPercent: 58,
    stableEntranceFeePercent: 0.5,
    elevatedEntranceFeePercent: 1.2,
    actualRateRaw: "3.1",
    description: "Praxis",
    indexerGaps: [],
    detail: USDC_PREDICTION_DETAIL,
  },
  {
    id: "hub-two-pool-usdc-2",
    title: "USDC Elevated Season",
    assetSymbol: "USDC",
    iconUrl: USDC_ICON_URL,
    status: { kind: "upcoming", startsAt: "2026-03-01T12:00:00.000Z", label: "Upcoming" },
    endsAt: "2026-03-15T23:59:59.000Z",
    isTradingOpen: true,
    tvlLabel: "$48.20",
    targetApyPercent: 2.4,
    predictedApyPercent: 4.2,
    stablePoolPercent: 61,
    elevatedPoolPercent: 39,
    stableEntranceFeePercent: 0.3,
    elevatedEntranceFeePercent: 0.9,
    actualRateRaw: "2.4",
    description: "Praxis",
    indexerGaps: [],
    detail: USDC_ELEVATED_SEASON_DETAIL,
  },
];

export function findTwoPoolHubMockById(id: string): TwoPool | undefined {
  return PREDICTIONS_HUB_TWO_POOL_MOCKS.find((pool) => pool.id === id);
}

export function getTwoPoolDetailBreadcrumb(): string {
  return "Yield Predictions • 2-pools";
}

export function formatTwoPoolSideLabel(side: "stable" | "elevated"): string {
  return side === "stable" ? "Stable" : "Elevated";
}
