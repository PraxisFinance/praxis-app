import type { PredictionsHubFilterState } from "@/shared/constants/predictionsHubFilters";
import type { CryptoPredictionTimeFilterId } from "@/shared/constants/cryptocurrencyPredictions";
import { USDC_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import {
  PREDICTIONS_HUB_ITEMS_BY_CATEGORY,
  type PredictionsHubItem,
} from "@/shared/types/predictionsHubItem";

function isoInHours(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

const HUB_MOCK_ICON = USDC_ICON_URL;
const HUB_MOCK_CPF_ADDRESS = "0x0000000000000000000000000000000000000001" as const;

function hubMockCpfPoolId(seed: number): bigint {
  return BigInt(seed);
}

/** Raw crypto predictions for hub card development (not used by legacy feeds). */
export const PREDICTIONS_HUB_CRYPTO_PREDICTION_MOCKS: CryptoPrediction[] = [
  {
    id: "hub-aero-updown-live",
    title: "AERO Up or Down",
    assetSymbol: "AERO",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: isoInHours(6),
    predictionType: "up_down",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(1),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    outcomes: [
      { id: "up", label: "Up", odds: 1.72, poolPercent: 65 },
      { id: "down", label: "Down", odds: 2.05, poolPercent: 35 },
    ],
  },
  {
    id: "hub-eth-updown-upcoming",
    title: "ETH Up or Down",
    assetSymbol: "ETH",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(2) },
    endsAt: isoInHours(30),
    predictionType: "up_down",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(2),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    outcomes: [
      { id: "up", label: "Up", odds: 1.9, poolPercent: 52 },
      { id: "down", label: "Down", odds: 1.95, poolPercent: 48 },
    ],
  },
  {
    id: "hub-sol-above-below",
    title: "SOL above key levels",
    assetSymbol: "SOL",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live" },
    endsAt: isoInHours(18),
    predictionType: "above_below",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(3),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    strikes: [
      {
        id: "s1",
        targetLabel: "$142.50",
        yes: { odds: 1.55, poolPercent: 58 },
        no: { odds: 2.35, poolPercent: 42 },
      },
      {
        id: "s2",
        targetLabel: "$148.00",
        yes: { odds: 2.1, poolPercent: 44 },
        no: { odds: 1.68, poolPercent: 56 },
      },
      {
        id: "s3",
        targetLabel: "$155.20",
        yes: { odds: 3.2, poolPercent: 31 },
        no: { odds: 1.32, poolPercent: 69 },
      },
    ],
  },
  {
    id: "hub-btc-range",
    title: "BTC price range (Feb close)",
    assetSymbol: "BTC",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(12) },
    endsAt: isoInHours(72),
    predictionType: "price_range",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(4),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    lowerBoundLabel: "$92,000",
    upperBoundLabel: "$98,000",
    outcomes: [
      { id: "inside", label: "Inside range", odds: 1.85, poolPercent: 54 },
      { id: "outside", label: "Outside range", odds: 1.92, poolPercent: 46 },
    ],
  },
  {
    id: "hub-hype-hit",
    title: "HYPE hits target",
    assetSymbol: "HYPE",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(6) },
    endsAt: isoInHours(48),
    predictionType: "hit",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(5),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    targetPriceLabel: "$25.00",
    outcomes: [
      { id: "hit", label: "Hit", odds: 2.4, poolPercent: 38 },
      { id: "miss", label: "Miss", odds: 1.52, poolPercent: 62 },
    ],
  },
  {
    id: "hub-link-ended",
    title: "LINK Up or Down",
    assetSymbol: "LINK",
    iconUrl: HUB_MOCK_ICON,
    status: {
      kind: "ended",
      resolutionSummary: "Resolved Down",
      endedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    endsAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    predictionType: "up_down",
    isTradingOpen: false,
    cpfPoolId: hubMockCpfPoolId(6),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    outcomes: [
      { id: "up", label: "Up", odds: 1.5, poolPercent: 40 },
      { id: "down", label: "Down", odds: 2.2, poolPercent: 60 },
    ],
  },
];

export function toCryptoHubItems(predictions: CryptoPrediction[]): Extract<
  PredictionsHubItem,
  { kind: "crypto" }
>[] {
  return predictions.map((prediction) => ({ kind: "crypto", prediction }));
}

/** Hub feed items — crypto cards only for now; other categories will be appended here. */
export const PREDICTIONS_HUB_CRYPTO_CARD_MOCKS = toCryptoHubItems(
  PREDICTIONS_HUB_CRYPTO_PREDICTION_MOCKS,
);

export const PREDICTIONS_HUB_CARD_MOCKS: PredictionsHubItem[] = [
  ...PREDICTIONS_HUB_CRYPTO_CARD_MOCKS,
];

const TIME_FILTER_MS: Record<CryptoPredictionTimeFilterId, number | null> = {
  all: null,
  live: null,
  "1h": 60 * 60_000,
  "6h": 6 * 60 * 60_000,
  "12h": 12 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  "2d": 2 * 24 * 60 * 60_000,
  "1w": 7 * 24 * 60 * 60_000,
};

function cryptoPredictionEndsAtMs(prediction: CryptoPrediction): number {
  return new Date(prediction.endsAt).getTime();
}

function matchesHubTimeFilter(
  item: PredictionsHubItem,
  timeId: CryptoPredictionTimeFilterId,
  nowMs: number,
): boolean {
  if (timeId === "all") return true;
  if (item.kind !== "crypto") return true;

  const end = cryptoPredictionEndsAtMs(item.prediction);
  if (timeId === "live") return end > nowMs;
  const windowMs = TIME_FILTER_MS[timeId];
  if (windowMs === null) return true;
  return end > nowMs && end <= nowMs + windowMs;
}

function matchesHubMarketTypeFilter(
  item: PredictionsHubItem,
  filters: PredictionsHubFilterState,
): boolean {
  if (filters.marketTypeId === "all") return true;
  if (item.kind !== "crypto") return true;
  return item.prediction.predictionType === filters.marketTypeId;
}

function isKindAllowedForCategory(
  kind: PredictionsHubItem["kind"],
  categoryId: PredictionsHubFilterState["categoryId"],
): boolean {
  const allowedKinds = PREDICTIONS_HUB_ITEMS_BY_CATEGORY[categoryId] as readonly PredictionsHubItem["kind"][];
  return allowedKinds.includes(kind);
}

/** Applies hub filter state to mock feed items (hub page only). */
export function filterPredictionsHubCardMocks(
  items: PredictionsHubItem[],
  filters: PredictionsHubFilterState,
  nowMs = Date.now(),
): PredictionsHubItem[] {
  return items
    .filter((item) => isKindAllowedForCategory(item.kind, filters.categoryId))
    .filter((item) => matchesHubMarketTypeFilter(item, filters))
    .filter((item) => matchesHubTimeFilter(item, filters.timeId, nowMs));
}

export function getPredictionsHubCardMocks(
  filters: PredictionsHubFilterState,
  nowMs = Date.now(),
): PredictionsHubItem[] {
  return filterPredictionsHubCardMocks(PREDICTIONS_HUB_CARD_MOCKS, filters, nowMs);
}
