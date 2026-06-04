import type { PredictionsHubFilterState } from "@/shared/constants/predictionsHubFilters";
import type { CryptoPredictionTimeFilterId } from "@/shared/constants/cryptocurrencyPredictions";
import { USDC_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { buildCryptoAboveBelowHubTitle } from "@/shared/utils/cryptoHubFormat";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { buildFinanceHubTitle, type FinanceHubEvent } from "@/shared/types/financeHubEvent";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import type { RandomPool, RandomPoolUserInPool } from "@/shared/types/randomPool";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import { INLINE_HINT_ICON_URL } from "@/shared/constants/inlineIcons";
import {
  getPredictionsHubItemId,
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
    title: "AERO Up or Down at 27 February?",
    assetSymbol: "AERO",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: new Date(Date.now() + (45 * 60 + 59) * 1000).toISOString(),
    predictionType: "up_down",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(1),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    volumeLabel: "$858.74K Vol.",
    outcomes: [
      { id: "up", label: "Up", odds: 1.72, poolPercent: 9.8 },
      { id: "down", label: "Down", odds: 2.05, poolPercent: 91.2 },
    ],
    upDownDetail: {
      baselinePriceLabel: "$25.807",
      priceChartPoints: [
        { timeLabel: "2:50pm", price: 25.42 },
        { timeLabel: "2:51pm", price: 25.55 },
        { timeLabel: "2:52pm", price: 25.38 },
        { timeLabel: "2:54pm", price: 25.62 },
        { timeLabel: "2:55pm", price: 25.154 },
      ],
      resolutionAssetLabel: "Meta (Pyth META/USD)",
      resolutionCloseDateLabel: "May 21, 2026",
      resolutionReferenceDateLabel: "May 20, 2026",
      resolutionReferencePriceLabel: "$604.94",
    },
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
    volumeLabel: "$412.10K Vol.",
    outcomes: [
      { id: "up", label: "Up", odds: 1.9, poolPercent: 52 },
      { id: "down", label: "Down", odds: 1.95, poolPercent: 48 },
    ],
  },
  {
    id: "hub-aero-above-below",
    title: buildCryptoAboveBelowHubTitle("AERO", "2026-02-27T15:30:00.000Z"),
    assetSymbol: "AERO",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: "2026-02-27T15:30:00.000Z",
    predictionType: "above_below",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(3),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    strikes: [
      {
        id: "s1",
        targetLabel: "16",
        yes: { odds: 1.01, poolPercent: 100 },
        no: { odds: 50, poolPercent: 0 },
      },
      {
        id: "s2",
        targetLabel: "25",
        yes: { odds: 1.01, poolPercent: 100 },
        no: { odds: 50, poolPercent: 0 },
      },
    ],
  },
  {
    id: "hub-aero-price-ranges",
    title: "AERO price on Feb 27?",
    assetSymbol: "AERO",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: "2026-02-27T15:30:00.000Z",
    predictionType: "above_below",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(7),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    strikes: [
      {
        id: "r1",
        targetLabel: "<16",
        yes: { odds: 12, poolPercent: 0.5 },
        no: { odds: 1.02, poolPercent: 99.5 },
      },
      {
        id: "r2",
        targetLabel: "16-25",
        yes: { odds: 8, poolPercent: 0.8 },
        no: { odds: 1.03, poolPercent: 99.2 },
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
    volumeLabel: "$1.05M Vol.",
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
    volumeLabel: "$198.20K Vol.",
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
    volumeLabel: "$76.30K Vol.",
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

/** Hub-only esports matches (relative dates for upcoming rows). */
export const PREDICTIONS_HUB_ESPORTS_MATCH_MOCKS: EsportsMatch[] = [
  {
    id: "hub-match-dota-live-1",
    gameId: "dota2",
    streamUrl: "https://www.youtube.com/live",
    isBettingAvailable: true,
    status: { kind: "live", label: "Live now" },
    team1: { name: "Inner Circle", logoUrl: "", odds: 1.35, score: 1 },
    team2: { name: "AVULUS", logoUrl: "", odds: 3.4, score: 0 },
    esportsDetail: {
      displayTitle: "Team Inner Circle vs AVULUS Team",
      volumeLabel: "$858.74K Vol.",
      chartPoints: [
        { timeLabel: "5:20pm", team1Percent: 52, team2Percent: 48 },
        { timeLabel: "5:40pm", team1Percent: 48, team2Percent: 52 },
        { timeLabel: "6:00pm", team1Percent: 55, team2Percent: 45 },
        { timeLabel: "6:20pm", team1Percent: 44, team2Percent: 56 },
        { timeLabel: "6:40pm", team1Percent: 38, team2Percent: 62 },
        { timeLabel: "7:00pm", team1Percent: 41, team2Percent: 59 },
      ],
      team1PoolPercent: 41,
      team2PoolPercent: 59,
    },
  },
  {
    id: "hub-match-csgo-live-1",
    gameId: "csgo",
    streamUrl: "https://www.twitch.tv/example",
    isBettingAvailable: true,
    status: { kind: "live" },
    team1: { name: "Natus Vincere", logoUrl: "", odds: 1.55, score: 9 },
    team2: { name: "FaZe Clan", logoUrl: "", odds: 2.35, score: 7 },
  },
  {
    id: "hub-match-csgo-live-2",
    gameId: "csgo",
    isBettingAvailable: false,
    status: { kind: "live", label: "Live now" },
    team1: { name: "Team Spirit", logoUrl: "", odds: 2.1, score: 4 },
    team2: { name: "MOUZ", logoUrl: "", odds: 1.72, score: 6 },
  },
  {
    id: "hub-match-lol-upcoming-1",
    gameId: "lol",
    isBettingAvailable: true,
    status: { kind: "upcoming", startsAt: isoInHours(2) },
    team1: { name: "T1", logoUrl: "", odds: 1.28 },
    team2: { name: "Gen.G", logoUrl: "", odds: 3.6 },
  },
  {
    id: "hub-match-valorant-finished-1",
    gameId: "valorant",
    isBettingAvailable: false,
    status: { kind: "finished", label: "Final" },
    team1: { name: "FNATIC", logoUrl: "", odds: 1.9, score: 2 },
    team2: { name: "LOUD", logoUrl: "", odds: 1.9, score: 0 },
  },
  {
    id: "hub-match-cod-upcoming-1",
    gameId: "cod",
    isBettingAvailable: true,
    status: { kind: "upcoming", startsAt: isoInHours(26) },
    team1: { name: "OpTic Texas", logoUrl: "", odds: 2.05 },
    team2: { name: "Atlanta FaZe", logoUrl: "", odds: 1.75 },
  },
];

export function toEsportsHubItems(matches: EsportsMatch[]): Extract<
  PredictionsHubItem,
  { kind: "esports" }
>[] {
  return matches.map((match) => ({ kind: "esports", match }));
}

/** Hub-only sport matches. */
export const PREDICTIONS_HUB_SPORT_MATCH_MOCKS: SportHubMatch[] = [
  {
    id: "hub-sport-football-live-1",
    disciplineId: "football",
    streamUrl: "https://www.youtube.com/live",
    isBettingAvailable: true,
    status: { kind: "live", label: "Live now" },
    team1: { name: "Arsenal", logoUrl: "", odds: 1.62, score: 1 },
    team2: { name: "Chelsea", logoUrl: "", odds: 2.4, score: 1 },
  },
  {
    id: "hub-sport-basketball-live-1",
    disciplineId: "basketball",
    streamUrl: "https://www.twitch.tv/example",
    isBettingAvailable: true,
    status: { kind: "live" },
    team1: { name: "Lakers", logoUrl: "", odds: 1.85, score: 78 },
    team2: { name: "Celtics", logoUrl: "", odds: 1.95, score: 82 },
  },
  {
    id: "hub-sport-hockey-upcoming-1",
    disciplineId: "hockey",
    isBettingAvailable: true,
    status: { kind: "upcoming", startsAt: isoInHours(4) },
    team1: { name: "Rangers", logoUrl: "", odds: 2.1 },
    team2: { name: "Bruins", logoUrl: "", odds: 1.72 },
  },
  {
    id: "hub-sport-formula1-upcoming-1",
    disciplineId: "formula1",
    isBettingAvailable: true,
    status: { kind: "upcoming", startsAt: isoInHours(18) },
    team1: { name: "Verstappen", logoUrl: "", odds: 1.45 },
    team2: { name: "Norris", logoUrl: "", odds: 3.2 },
  },
  {
    id: "hub-sport-football-finished-1",
    disciplineId: "football",
    isBettingAvailable: false,
    status: { kind: "finished", label: "Final" },
    team1: { name: "Barcelona", logoUrl: "", odds: 1.7, score: 2 },
    team2: { name: "Real Madrid", logoUrl: "", odds: 2.15, score: 1 },
  },
];

export function toSportHubItems(matches: SportHubMatch[]): Extract<
  PredictionsHubItem,
  { kind: "sport" }
>[] {
  return matches.map((match) => ({ kind: "sport", match }));
}

export const PREDICTIONS_HUB_CRYPTO_CARD_MOCKS = toCryptoHubItems(
  PREDICTIONS_HUB_CRYPTO_PREDICTION_MOCKS,
);

export const PREDICTIONS_HUB_ESPORTS_CARD_MOCKS = toEsportsHubItems(
  PREDICTIONS_HUB_ESPORTS_MATCH_MOCKS,
);

export const PREDICTIONS_HUB_SPORT_CARD_MOCKS = toSportHubItems(PREDICTIONS_HUB_SPORT_MATCH_MOCKS);

/** Hub-only politics markets (binary Yes / No). */
export const PREDICTIONS_HUB_POLITICS_EVENT_MOCKS: PoliticsHubEvent[] = [
  {
    id: "hub-politics-trump-2027",
    title: "Trump out as President before 2027?",
    thumbnailUrl: "",
    endsAt: isoInHours(720),
    volumeLabel: "$858.74K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 9.8, odds: 8.5 },
      { id: "no", label: "No", poolPercent: 90.2, odds: 1.12 },
    ],
  },
  {
    id: "hub-politics-fed-rate-cut",
    title: "Fed cuts rates before July 2026?",
    thumbnailUrl: "",
    endsAt: isoInHours(480),
    volumeLabel: "$412.30K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 42, odds: 2.1 },
      { id: "no", label: "No", poolPercent: 58, odds: 1.65 },
    ],
  },
  {
    id: "hub-politics-uk-election",
    title: "Snap UK general election called in 2026?",
    thumbnailUrl: "",
    endsAt: isoInHours(168),
    volumeLabel: "$156.20K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 28.5, odds: 3.2 },
      { id: "no", label: "No", poolPercent: 71.5, odds: 1.35 },
    ],
  },
  {
    id: "hub-politics-eu-sanctions",
    title: "New EU sanctions package passed by Q3 2026?",
    thumbnailUrl: "",
    endsAt: isoInHours(96),
    volumeLabel: "$89.50K Vol.",
    isTradingOpen: false,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 61, odds: 1.55 },
      { id: "no", label: "No", poolPercent: 39, odds: 2.45 },
    ],
  },
];

export function toPoliticsHubItems(events: PoliticsHubEvent[]): Extract<
  PredictionsHubItem,
  { kind: "politics" }
>[] {
  return events.map((event) => ({ kind: "politics", event }));
}

export const PREDICTIONS_HUB_POLITICS_CARD_MOCKS = toPoliticsHubItems(
  PREDICTIONS_HUB_POLITICS_EVENT_MOCKS,
);

/** Hub-only finance markets (binary Up / Down). */
export const PREDICTIONS_HUB_FINANCE_EVENT_MOCKS: FinanceHubEvent[] = [
  {
    id: "hub-finance-meta-updown",
    assetName: "Meta",
    assetTicker: "META",
    logoUrl: "",
    title: buildFinanceHubTitle("Meta", "META"),
    endsAt: isoInHours(720),
    volumeLabel: "$858.74K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 90.2, odds: 1.12 },
      { id: "down", label: "Down", poolPercent: 9.8, odds: 8.5 },
    ],
  },
  {
    id: "hub-finance-aapl-updown",
    assetName: "Apple",
    assetTicker: "AAPL",
    logoUrl: "",
    title: buildFinanceHubTitle("Apple", "AAPL"),
    endsAt: isoInHours(336),
    volumeLabel: "$1.24M Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 54, odds: 1.75 },
      { id: "down", label: "Down", poolPercent: 46, odds: 2.05 },
    ],
  },
  {
    id: "hub-finance-tsla-updown",
    assetName: "Tesla",
    assetTicker: "TSLA",
    logoUrl: "",
    title: buildFinanceHubTitle("Tesla", "TSLA"),
    endsAt: isoInHours(120),
    volumeLabel: "$642.10K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 38.5, odds: 2.35 },
      { id: "down", label: "Down", poolPercent: 61.5, odds: 1.48 },
    ],
  },
  {
    id: "hub-finance-nvda-updown",
    assetName: "NVIDIA",
    assetTicker: "NVDA",
    logoUrl: "",
    title: buildFinanceHubTitle("NVIDIA", "NVDA"),
    endsAt: isoInHours(48),
    volumeLabel: "$2.08M Vol.",
    isTradingOpen: false,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 72, odds: 1.32 },
      { id: "down", label: "Down", poolPercent: 28, odds: 3.1 },
    ],
  },
];

export function toFinanceHubItems(events: FinanceHubEvent[]): Extract<
  PredictionsHubItem,
  { kind: "finance" }
>[] {
  return events.map((event) => ({ kind: "finance", event }));
}

export const PREDICTIONS_HUB_FINANCE_CARD_MOCKS = toFinanceHubItems(
  PREDICTIONS_HUB_FINANCE_EVENT_MOCKS,
);

const HUB_RANDOM_POOL_PARTICIPANT_MOCKS: RandomPoolUserInPool[] = [
  { username: "Mizori", amount: "$1000", avatarUrl: USDC_ICON_URL },
  { username: "Kisara", amount: "$1500" },
  { username: "Tazumi", amount: "$2000", avatarUrl: INLINE_HINT_ICON_URL },
  { username: "Rinara", amount: "$2500" },
  { username: "Yoshiko", amount: "$3000" },
];

/** Hub-only random reward pools (not used by legacy RandomRewardsPage). */
export const PREDICTIONS_HUB_RANDOM_POOL_MOCKS: RandomPool[] = [
  {
    id: "hub-pool-live-1",
    title: "Random pool #1",
    iconUrl: INLINE_HINT_ICON_URL,
    status: "live",
    tvl: "$100,00",
    expectedYield: "$1000",
    usersIn: 101,
    progressPercent: 45,
    remainingTime: { days: 1, hours: 24, minutes: 54, seconds: 3 },
    hubDetail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS,
      walletBalance: "5000",
    },
  },
  {
    id: "hub-pool-live-2",
    title: "Random pool #2",
    status: "live",
    tvl: "50.000$",
    expectedYield: "$5000",
    usersIn: 120,
    progressPercent: 72,
    remainingTime: { days: 0, hours: 3, minutes: 45, seconds: 8 },
    hubDetail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS.slice(0, 3),
      walletBalance: "12000",
    },
  },
  {
    id: "hub-pool-ended-neutral",
    title: "Random pool #3",
    status: "ended",
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    usersInPool: 101,
    progressPercent: 100,
    userWon: false,
    hubDetail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS,
      winners: [
        { username: "Mizori", amount: "$333,33", avatarUrl: USDC_ICON_URL },
        { username: "Kisara", amount: "$333,33" },
        { username: "Tazumi", amount: "$333,34" },
      ],
    },
  },
  {
    id: "hub-pool-ended-won",
    title: "Random pool #4",
    status: "ended",
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    usersInPool: 54,
    progressPercent: 100,
    userWon: true,
    hubDetail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS.slice(0, 4),
      winners: [
        { username: "Mizori", amount: "$333,33", avatarUrl: USDC_ICON_URL },
        { username: "Kisara", amount: "$333,33" },
        { username: "Tazumi", amount: "$333,34" },
      ],
    },
  },
];

export function toRandomRewardHubItems(pools: RandomPool[]): Extract<
  PredictionsHubItem,
  { kind: "random-reward" }
>[] {
  return pools.map((pool) => ({ kind: "random-reward", pool }));
}

export const PREDICTIONS_HUB_RANDOM_REWARD_CARD_MOCKS = toRandomRewardHubItems(
  PREDICTIONS_HUB_RANDOM_POOL_MOCKS,
);

export const PREDICTIONS_HUB_CARD_MOCKS: PredictionsHubItem[] = [
  ...PREDICTIONS_HUB_CRYPTO_CARD_MOCKS,
  ...PREDICTIONS_HUB_ESPORTS_CARD_MOCKS,
  ...PREDICTIONS_HUB_SPORT_CARD_MOCKS,
  ...PREDICTIONS_HUB_POLITICS_CARD_MOCKS,
  ...PREDICTIONS_HUB_FINANCE_CARD_MOCKS,
  ...PREDICTIONS_HUB_RANDOM_REWARD_CARD_MOCKS,
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

function hubItemEndsAtMs(item: PredictionsHubItem): number | null {
  switch (item.kind) {
    case "crypto":
      return new Date(item.prediction.endsAt).getTime();
    case "politics":
    case "finance":
      return new Date(item.event.endsAt).getTime();
    case "tech":
      return item.event.endsAt ? new Date(item.event.endsAt).getTime() : null;
    default:
      return null;
  }
}

function matchesHubTimeFilter(
  item: PredictionsHubItem,
  timeId: CryptoPredictionTimeFilterId,
  nowMs: number,
): boolean {
  if (timeId === "all") return true;

  const end = hubItemEndsAtMs(item);
  if (end === null || Number.isNaN(end)) return true;

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
  if (item.kind === "crypto") {
    return item.prediction.predictionType === filters.marketTypeId;
  }
  if (item.kind === "finance") {
    return filters.marketTypeId === "up_down";
  }
  return true;
}

function matchesHubEsportsGameFilter(
  item: PredictionsHubItem,
  filters: PredictionsHubFilterState,
): boolean {
  if (filters.esportsGameId == null) return true;
  if (item.kind !== "esports") return true;
  return item.match.gameId === filters.esportsGameId;
}

function matchesHubSportDisciplineFilter(
  item: PredictionsHubItem,
  filters: PredictionsHubFilterState,
): boolean {
  if (filters.sportDisciplineId == null) return true;
  if (item.kind !== "sport") return true;
  return item.match.disciplineId === filters.sportDisciplineId;
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
    .filter((item) => matchesHubEsportsGameFilter(item, filters))
    .filter((item) => matchesHubSportDisciplineFilter(item, filters))
    .filter((item) => matchesHubTimeFilter(item, filters.timeId, nowMs));
}

export function getPredictionsHubCardMocks(
  filters: PredictionsHubFilterState,
  nowMs = Date.now(),
): PredictionsHubItem[] {
  return filterPredictionsHubCardMocks(PREDICTIONS_HUB_CARD_MOCKS, filters, nowMs);
}

/** Resolves a hub feed item by id (mocks until API). */
export function findPredictionsHubItemById(id: string): PredictionsHubItem | undefined {
  return PREDICTIONS_HUB_CARD_MOCKS.find((item) => getPredictionsHubItemId(item) === id);
}
