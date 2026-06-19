import type { PredictionsHubFilterState } from "@/shared/constants/predictionsHubFilters";
import type { CryptoPredictionTimeFilterId } from "@/shared/constants/cryptocurrencyPredictions";
import { USDC_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { CryptoPrediction, CryptoPredictionHubMarketDetail } from "@/shared/types/cryptoPrediction";
import { buildCryptoAboveBelowHubTitle } from "@/shared/utils/cryptoHubFormat";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { buildFinanceHubTitle, type FinanceHubEvent } from "@/shared/types/financeHubEvent";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import type { RandomPool, RandomPoolUserInPool } from "@/shared/types/randomPool";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import type { TechHubEvent } from "@/shared/types/techHubEvent";
import { INLINE_HINT_ICON_URL } from "@/shared/constants/inlineIcons";
import {
  getCryptoMarketType,
  getPredictionsHubItemId,
  getPredictionsHubItemKind,
  isCryptoPredictionCard,
  predictionTypeMatchesHubCategory,
  type PredictionsHubListItem,
} from "@/shared/types/predictions";

function isoInHours(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

function tagEsportsMatch(match: Omit<EsportsMatch, "predictionType">): EsportsMatch {
  return { ...match, predictionType: "esports" };
}

function tagSportMatch(match: Omit<SportHubMatch, "predictionType">): SportHubMatch {
  return { ...match, predictionType: "sport" };
}

function tagPoliticsEvent(
  event: Omit<PoliticsHubEvent, "predictionType" | "status">,
): PoliticsHubEvent {
  return {
    ...event,
    predictionType: "politics",
    status: event.isTradingOpen ? { kind: "live" } : { kind: "ended" },
  };
}

function tagFinanceEvent(
  event: Omit<FinanceHubEvent, "predictionType" | "status">,
): FinanceHubEvent {
  return {
    ...event,
    predictionType: "finance",
    status: event.isTradingOpen ? { kind: "live" } : { kind: "ended" },
  };
}

function tagTechEvent(event: Omit<TechHubEvent, "predictionType" | "status">): TechHubEvent {
  return {
    ...event,
    predictionType: "tech",
    status: event.isTradingOpen ? { kind: "live" } : { kind: "ended" },
  };
}

function tagRandomPool<T extends Omit<RandomPool, "predictionType">>(
  pool: T,
): T & { predictionType: "random_reward" } {
  return { ...pool, predictionType: "random_reward" };
}

const HUB_MOCK_ICON = USDC_ICON_URL;
const HUB_MOCK_CPF_ADDRESS = "0x0000000000000000000000000000000000000001" as const;

function hubMockCpfPoolId(seed: number): bigint {
  return BigInt(seed);
}

const HUB_CRYPTO_DETAIL_CHART_POINTS: CryptoPredictionHubMarketDetail["priceChartPoints"] = [
  { timeLabel: "2:50pm", price: 25.42 },
  { timeLabel: "2:51pm", price: 25.55 },
  { timeLabel: "2:52pm", price: 25.38 },
  { timeLabel: "2:54pm", price: 25.62 },
  { timeLabel: "2:55pm", price: 25.154 },
];

function hubCryptoMarketDetail(
  assetSymbol: string,
  baselinePriceLabel: string,
  referencePriceLabel: string,
): CryptoPredictionHubMarketDetail {
  return {
    baselinePriceLabel,
    priceChartPoints: HUB_CRYPTO_DETAIL_CHART_POINTS,
    resolutionAssetLabel: `${assetSymbol} (Pyth ${assetSymbol}/USD)`,
    resolutionCloseDateLabel: "February 27, 2026",
    resolutionReferenceDateLabel: "February 26, 2026",
    resolutionReferencePriceLabel: referencePriceLabel,
  };
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
    predictionType: "crypto_up_down",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(1),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    volumeLabel: "$858.74K Vol.",
    outcomes: [
      { id: "up", label: "Up", odds: 1.72, poolPercent: 9.8 },
      { id: "down", label: "Down", odds: 2.05, poolPercent: 91.2 },
    ],
    detail: {
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
    predictionType: "crypto_up_down",
    isTradingOpen: true,
    cpfPoolId: hubMockCpfPoolId(2),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    volumeLabel: "$412.10K Vol.",
    outcomes: [
      { id: "up", label: "Up", odds: 1.9, poolPercent: 52 },
      { id: "down", label: "Down", odds: 1.95, poolPercent: 48 },
    ],
    detail: hubCryptoMarketDetail("ETH", "$3,842.50", "$3,798.20"),
  },
  {
    id: "hub-aero-above-below",
    title: buildCryptoAboveBelowHubTitle("AERO", "2026-02-27T15:30:00.000Z"),
    assetSymbol: "AERO",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: "2026-02-27T15:30:00.000Z",
    predictionType: "crypto_above_below",
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
    detail: hubCryptoMarketDetail("AERO", "$18.42", "$17.95"),
  },
  {
    id: "hub-aero-price-ranges",
    title: "AERO price on Feb 27?",
    assetSymbol: "AERO",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: "2026-02-27T15:30:00.000Z",
    predictionType: "crypto_above_below",
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
    detail: hubCryptoMarketDetail("AERO", "$18.42", "$17.95"),
  },
  {
    id: "hub-btc-range",
    title: "BTC price range (Feb close)",
    assetSymbol: "BTC",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(12) },
    endsAt: isoInHours(72),
    predictionType: "crypto_price_range",
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
    detail: hubCryptoMarketDetail("BTC", "$94,250.00", "$93,880.00"),
  },
  {
    id: "hub-hype-hit",
    title: "HYPE hits target",
    assetSymbol: "HYPE",
    iconUrl: HUB_MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(6) },
    endsAt: isoInHours(48),
    predictionType: "crypto_hit",
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
    detail: hubCryptoMarketDetail("HYPE", "$22.18", "$21.74"),
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
    predictionType: "crypto_up_down",
    isTradingOpen: false,
    cpfPoolId: hubMockCpfPoolId(6),
    cpfAddress: HUB_MOCK_CPF_ADDRESS,
    categories: ["crypto"],
    volumeLabel: "$76.30K Vol.",
    outcomes: [
      { id: "up", label: "Up", odds: 1.5, poolPercent: 40 },
      { id: "down", label: "Down", odds: 2.2, poolPercent: 60 },
    ],
    detail: hubCryptoMarketDetail("LINK", "$14.82", "$15.01"),
  },
];

/** Hub-only esports matches (relative dates for upcoming rows). */
export const PREDICTIONS_HUB_ESPORTS_MATCH_MOCKS: EsportsMatch[] = [
  tagEsportsMatch({
    id: "hub-match-dota-live-1",
    gameId: "dota2",
    streamUrl: "https://www.youtube.com/live",
    isTradingOpen: true,
    status: { kind: "live", label: "Live now" },
    participantA: { name: "Inner Circle", logoUrl: "", odds: 1.35, score: 1 },
    participantB: { name: "AVULUS", logoUrl: "", odds: 3.4, score: 0 },
    detail: {
      displayTitle: "Team Inner Circle vs AVULUS Team",
      volumeLabel: "$858.74K Vol.",
      chartPoints: [
        { timeLabel: "5:20pm", participantAPercent: 52, participantBPercent: 48 },
        { timeLabel: "5:40pm", participantAPercent: 48, participantBPercent: 52 },
        { timeLabel: "6:00pm", participantAPercent: 55, participantBPercent: 45 },
        { timeLabel: "6:20pm", participantAPercent: 44, participantBPercent: 56 },
        { timeLabel: "6:40pm", participantAPercent: 38, participantBPercent: 62 },
        { timeLabel: "7:00pm", participantAPercent: 41, participantBPercent: 59 },
      ],
      participantAPoolPercent: 41,
      participantBPoolPercent: 59,
    },
  }),
  tagEsportsMatch({
    id: "hub-match-csgo-live-1",
    gameId: "csgo",
    streamUrl: "https://www.twitch.tv/example",
    isTradingOpen: true,
    status: { kind: "live" },
    participantA: { name: "Natus Vincere", logoUrl: "", odds: 1.55, score: 9 },
    participantB: { name: "FaZe Clan", logoUrl: "", odds: 2.35, score: 7 },
  }),
  tagEsportsMatch({
    id: "hub-match-csgo-live-2",
    gameId: "csgo",
    isTradingOpen: false,
    status: { kind: "live", label: "Live now" },
    participantA: { name: "Team Spirit", logoUrl: "", odds: 2.1, score: 4 },
    participantB: { name: "MOUZ", logoUrl: "", odds: 1.72, score: 6 },
  }),
  tagEsportsMatch({
    id: "hub-match-lol-upcoming-1",
    gameId: "lol",
    isTradingOpen: true,
    status: { kind: "upcoming", startsAt: isoInHours(2) },
    participantA: { name: "T1", logoUrl: "", odds: 1.28 },
    participantB: { name: "Gen.G", logoUrl: "", odds: 3.6 },
  }),
  tagEsportsMatch({
    id: "hub-match-valorant-finished-1",
    gameId: "valorant",
    isTradingOpen: false,
    status: { kind: "finished", label: "Final" },
    participantA: { name: "FNATIC", logoUrl: "", odds: 1.9, score: 2 },
    participantB: { name: "LOUD", logoUrl: "", odds: 1.9, score: 0 },
  }),
  tagEsportsMatch({
    id: "hub-match-cod-upcoming-1",
    gameId: "cod",
    isTradingOpen: true,
    status: { kind: "upcoming", startsAt: isoInHours(26) },
    participantA: { name: "OpTic Texas", logoUrl: "", odds: 2.05 },
    participantB: { name: "Atlanta FaZe", logoUrl: "", odds: 1.75 },
  }),
];

/** Hub-only sport matches. */
export const PREDICTIONS_HUB_SPORT_MATCH_MOCKS: SportHubMatch[] = [
  tagSportMatch({
    id: "hub-sport-football-live-1",
    disciplineId: "football",
    streamUrl: "https://www.youtube.com/live",
    isTradingOpen: true,
    status: { kind: "upcoming", startsAt: "2026-05-24T19:00:00.000Z" },
    participantA: { name: "Napoli", logoUrl: "", odds: 1.62 },
    participantB: { name: "Udinese", logoUrl: "", odds: 2.4 },
    detail: {
      displayTitle: "Napoli Team vs Udinese Team",
      volumeLabel: "$858.74K Vol.",
      chartPoints: [
        { timeLabel: "5:20pm", participantAPercent: 55, participantBPercent: 45 },
        { timeLabel: "5:40pm", participantAPercent: 48, participantBPercent: 52 },
        { timeLabel: "6:00pm", participantAPercent: 53, participantBPercent: 47 },
        { timeLabel: "6:20pm", participantAPercent: 44, participantBPercent: 56 },
        { timeLabel: "6:40pm", participantAPercent: 38, participantBPercent: 62 },
        { timeLabel: "7:00pm", participantAPercent: 60, participantBPercent: 30 },
      ],
      participantAPoolPercent: 60,
      participantBPoolPercent: 30,
      resolutionDeadlineLabel: "June 23, 2026",
    },
  }),
  tagSportMatch({
    id: "hub-sport-basketball-live-1",
    disciplineId: "basketball",
    streamUrl: "https://www.twitch.tv/example",
    isTradingOpen: true,
    status: { kind: "live" },
    participantA: { name: "Lakers", logoUrl: "", odds: 1.85, score: 78 },
    participantB: { name: "Celtics", logoUrl: "", odds: 1.95, score: 82 },
  }),
  tagSportMatch({
    id: "hub-sport-hockey-upcoming-1",
    disciplineId: "hockey",
    isTradingOpen: true,
    status: { kind: "upcoming", startsAt: isoInHours(4) },
    participantA: { name: "Rangers", logoUrl: "", odds: 2.1 },
    participantB: { name: "Bruins", logoUrl: "", odds: 1.72 },
  }),
  tagSportMatch({
    id: "hub-sport-formula1-upcoming-1",
    disciplineId: "formula1",
    isTradingOpen: true,
    status: { kind: "upcoming", startsAt: isoInHours(18) },
    participantA: { name: "Verstappen", logoUrl: "", odds: 1.45 },
    participantB: { name: "Norris", logoUrl: "", odds: 3.2 },
  }),
  tagSportMatch({
    id: "hub-sport-football-finished-1",
    disciplineId: "football",
    isTradingOpen: false,
    status: { kind: "finished", label: "Final" },
    participantA: { name: "Barcelona", logoUrl: "", odds: 1.7, score: 2 },
    participantB: { name: "Real Madrid", logoUrl: "", odds: 2.15, score: 1 },
  }),
];

export const PREDICTIONS_HUB_CRYPTO_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_CRYPTO_PREDICTION_MOCKS;

export const PREDICTIONS_HUB_ESPORTS_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_ESPORTS_MATCH_MOCKS;

export const PREDICTIONS_HUB_SPORT_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_SPORT_MATCH_MOCKS;

/** Hub-only politics markets (binary Yes / No). */
export const PREDICTIONS_HUB_POLITICS_EVENT_MOCKS: PoliticsHubEvent[] = [
  tagPoliticsEvent({
    id: "hub-politics-trump-2027",
    title: "Trump out as President before 2027?",
    imageUrl: "",
    endsAt: isoInHours(720),
    volumeLabel: "$858.74K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 9.8, odds: 8.5 },
      { id: "no", label: "No", poolPercent: 90.2, odds: 1.12 },
    ],
    detail: {
      chartPoints: [
        { timeLabel: "5:20pm", yesPercent: 12 },
        { timeLabel: "5:40pm", yesPercent: 8 },
        { timeLabel: "6:00pm", yesPercent: 15 },
        { timeLabel: "6:20pm", yesPercent: 7 },
        { timeLabel: "6:40pm", yesPercent: 11 },
        { timeLabel: "7:00pm", yesPercent: 9.8 },
      ],
      resolutionParagraphs: [
        "This market will resolve to \"Yes\" if Donald J. Trump ceases to be President of the United States for any period of time between February 27, 2026 and December 31, 2026, 11:59 PM ET. Otherwise, this market will resolve to \"No\".",
        "An announcement of Trump's resignation/removal, or a definitive consensus of credible reporting that he has resigned/been removed, will suffice — regardless of whether he has yet vacated the office.",
        "The resolution source will be a consensus of credible reporting.",
      ],
    },
  }),
  tagPoliticsEvent({
    id: "hub-politics-fed-rate-cut",
    title: "Fed cuts rates before July 2026?",
    imageUrl: "",
    endsAt: isoInHours(480),
    volumeLabel: "$412.30K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 42, odds: 2.1 },
      { id: "no", label: "No", poolPercent: 58, odds: 1.65 },
    ],
  }),
  tagPoliticsEvent({
    id: "hub-politics-uk-election",
    title: "Snap UK general election called in 2026?",
    imageUrl: "",
    endsAt: isoInHours(168),
    volumeLabel: "$156.20K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 28.5, odds: 3.2 },
      { id: "no", label: "No", poolPercent: 71.5, odds: 1.35 },
    ],
  }),
  tagPoliticsEvent({
    id: "hub-politics-eu-sanctions",
    title: "New EU sanctions package passed by Q3 2026?",
    imageUrl: "",
    endsAt: isoInHours(96),
    volumeLabel: "$89.50K Vol.",
    isTradingOpen: false,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 61, odds: 1.55 },
      { id: "no", label: "No", poolPercent: 39, odds: 2.45 },
    ],
  }),
];

export const PREDICTIONS_HUB_POLITICS_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_POLITICS_EVENT_MOCKS;

/** Hub-only tech markets (binary Yes / No). */
export const PREDICTIONS_HUB_TECH_EVENT_MOCKS: TechHubEvent[] = [
  tagTechEvent({
    id: "hub-tech-gpt5-launch",
    title: "GPT-5 released before July 2026?",
    imageUrl: "",
    endsAt: isoInHours(540),
    volumeLabel: "$624.10K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 67.5, odds: 1.42 },
      { id: "no", label: "No", poolPercent: 32.5, odds: 2.85 },
    ],
    detail: {
      chartPoints: [
        { timeLabel: "9:00am", yesPercent: 58 },
        { timeLabel: "10:00am", yesPercent: 62 },
        { timeLabel: "11:00am", yesPercent: 55 },
        { timeLabel: "12:00pm", yesPercent: 70 },
        { timeLabel: "1:00pm", yesPercent: 64 },
        { timeLabel: "2:00pm", yesPercent: 67.5 },
      ],
      resolutionParagraphs: [
        'This market will resolve to "Yes" if OpenAI publicly releases a model branded as GPT-5 (including GPT-5, GPT-5 Turbo, or an equivalent successor name) before July 1, 2026, 11:59 PM ET. Otherwise, it will resolve to "No".',
        "A release counts if it is generally available to the public or announced as GA with a fixed launch date on or before the deadline. Private previews, waitlists, or research-only demos do not count.",
        "The resolution source will be a consensus of credible reporting and official OpenAI announcements.",
      ],
    },
  }),
  tagTechEvent({
    id: "hub-tech-apple-foldable",
    title: "Apple announces foldable iPhone before 2027?",
    imageUrl: "",
    endsAt: isoInHours(960),
    volumeLabel: "$318.45K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 22.3, odds: 4.1 },
      { id: "no", label: "No", poolPercent: 77.7, odds: 1.22 },
    ],
    detail: {
      chartPoints: [
        { timeLabel: "Mon", yesPercent: 18 },
        { timeLabel: "Tue", yesPercent: 21 },
        { timeLabel: "Wed", yesPercent: 19 },
        { timeLabel: "Thu", yesPercent: 24 },
        { timeLabel: "Fri", yesPercent: 20 },
        { timeLabel: "Sat", yesPercent: 22.3 },
      ],
      resolutionParagraphs: [
        'This market will resolve to "Yes" if Apple Inc. officially announces a foldable iPhone product line before January 1, 2027, 11:59 PM ET. Otherwise, it will resolve to "No".',
        "An announcement at an Apple event, press release, or SEC filing that confirms a foldable iPhone is in development with a stated launch window will suffice.",
        "Rumors, patents, or supply-chain leaks alone will not count toward resolution.",
      ],
    },
  }),
  tagTechEvent({
    id: "hub-tech-spacex-starship",
    title: "SpaceX lands Starship on Mars before 2028?",
    imageUrl: "",
    endsAt: isoInHours(1200),
    volumeLabel: "$892.60K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 14.6, odds: 6.2 },
      { id: "no", label: "No", poolPercent: 85.4, odds: 1.08 },
    ],
    detail: {
      chartPoints: [
        { timeLabel: "Jan", yesPercent: 11 },
        { timeLabel: "Feb", yesPercent: 13 },
        { timeLabel: "Mar", yesPercent: 10 },
        { timeLabel: "Apr", yesPercent: 12 },
        { timeLabel: "May", yesPercent: 15 },
        { timeLabel: "Jun", yesPercent: 14.6 },
      ],
      resolutionParagraphs: [
        'This market will resolve to "Yes" if SpaceX successfully lands a Starship vehicle on the surface of Mars before January 1, 2028, 11:59 PM ET. Otherwise, it will resolve to "No".',
        "A landing counts if SpaceX or a consensus of credible reporting confirms that a Starship vehicle made controlled contact with the Martian surface and transmitted telemetry afterward.",
        "Flybys, orbit-only missions, or uncrewed crash landings without confirmation do not count.",
      ],
    },
  }),
  tagTechEvent({
    id: "hub-tech-nvidia-4nm",
    title: "NVIDIA ships consumer Blackwell Ultra GPUs in 2026?",
    imageUrl: "",
    endsAt: isoInHours(72),
    volumeLabel: "$205.80K Vol.",
    isTradingOpen: false,
    outcomes: [
      { id: "yes", label: "Yes", poolPercent: 54.2, odds: 1.78 },
      { id: "no", label: "No", poolPercent: 45.8, odds: 2.05 },
    ],
    detail: {
      chartPoints: [
        { timeLabel: "W1", yesPercent: 48 },
        { timeLabel: "W2", yesPercent: 52 },
        { timeLabel: "W3", yesPercent: 50 },
        { timeLabel: "W4", yesPercent: 56 },
        { timeLabel: "W5", yesPercent: 53 },
        { timeLabel: "W6", yesPercent: 54.2 },
      ],
      resolutionParagraphs: [
        'This market will resolve to "Yes" if NVIDIA begins shipping consumer-grade Blackwell Ultra GPUs to retail customers before December 31, 2026, 11:59 PM ET. Otherwise, it will resolve to "No".',
        "Shipping counts when units are available for purchase by consumers through NVIDIA, authorized board partners, or major retailers — not solely to enterprise/data-center customers.",
        "The resolution source will be a consensus of credible reporting and official NVIDIA product pages.",
      ],
    },
  }),
];

export const PREDICTIONS_HUB_TECH_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_TECH_EVENT_MOCKS;

/** Hub-only finance markets (binary Up / Down). */
export const PREDICTIONS_HUB_FINANCE_EVENT_MOCKS: FinanceHubEvent[] = [
  tagFinanceEvent({
    id: "hub-finance-meta-updown",
    assetName: "Meta",
    assetTicker: "META",
    imageUrl: "",
    title: buildFinanceHubTitle("Meta", "META"),
    endsAt: new Date(Date.now() + (45 * 60 + 59) * 1000).toISOString(),
    volumeLabel: "$858.74K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 9.8, odds: 8.5 },
      { id: "down", label: "Down", poolPercent: 91.2, odds: 1.12 },
    ],
    detail: {
      baselinePriceLabel: "$1.3552",
      priceChartPoints: [
        { timeLabel: "2:50pm", price: 1.38 },
        { timeLabel: "2:51pm", price: 1.36 },
        { timeLabel: "2:52pm", price: 1.34 },
        { timeLabel: "2:54pm", price: 1.31 },
        { timeLabel: "2:55pm", price: 1.2999 },
      ],
      resolutionAssetLabel: "Meta (Pyth META/USD)",
      resolutionCloseDateLabel: "May 21, 2026",
      resolutionReferenceDateLabel: "May 20, 2026",
      resolutionReferencePriceLabel: "$604.94",
      resolutionSourceLabel: "Pyth META/USD price feed",
    },
  }),
  tagFinanceEvent({
    id: "hub-finance-aapl-updown",
    assetName: "Apple",
    assetTicker: "AAPL",
    imageUrl: "",
    title: buildFinanceHubTitle("Apple", "AAPL"),
    endsAt: isoInHours(336),
    volumeLabel: "$1.24M Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 54, odds: 1.75 },
      { id: "down", label: "Down", poolPercent: 46, odds: 2.05 },
    ],
  }),
  tagFinanceEvent({
    id: "hub-finance-tsla-updown",
    assetName: "Tesla",
    assetTicker: "TSLA",
    imageUrl: "",
    title: buildFinanceHubTitle("Tesla", "TSLA"),
    endsAt: isoInHours(120),
    volumeLabel: "$642.10K Vol.",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 38.5, odds: 2.35 },
      { id: "down", label: "Down", poolPercent: 61.5, odds: 1.48 },
    ],
  }),
  tagFinanceEvent({
    id: "hub-finance-nvda-updown",
    assetName: "NVIDIA",
    assetTicker: "NVDA",
    imageUrl: "",
    title: buildFinanceHubTitle("NVIDIA", "NVDA"),
    endsAt: isoInHours(48),
    volumeLabel: "$2.08M Vol.",
    isTradingOpen: false,
    outcomes: [
      { id: "up", label: "Up", poolPercent: 72, odds: 1.32 },
      { id: "down", label: "Down", poolPercent: 28, odds: 3.1 },
    ],
  }),
];

export const PREDICTIONS_HUB_FINANCE_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_FINANCE_EVENT_MOCKS;

const HUB_RANDOM_POOL_PARTICIPANT_MOCKS: RandomPoolUserInPool[] = [
  { username: "Mizori", amount: "$1000", avatarUrl: USDC_ICON_URL },
  { username: "Kisara", amount: "$1500" },
  { username: "Tazumi", amount: "$2000", avatarUrl: INLINE_HINT_ICON_URL },
  { username: "Rinara", amount: "$2500" },
  { username: "Yoshiko", amount: "$3000" },
];

/**
 * @deprecated Real RYD data is now sourced from `useRYDStore` via `rydDataToRandomPool`.
 * Kept for Storybook / test fixtures only.
 */
export const PREDICTIONS_HUB_RANDOM_POOL_MOCKS: RandomPool[] = [
  tagRandomPool({
    id: "hub-pool-live-1",
    title: "Random pool #1",
    iconUrl: INLINE_HINT_ICON_URL,
    status: { kind: "live" },
    tvl: "$100,00",
    expectedYield: "$1000",
    usersIn: 101,
    progressPercent: 45,
    remainingTime: { days: 1, hours: 24, minutes: 54, seconds: 3 },
    detail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS,
      walletBalance: "5000",
    },
  }),
  tagRandomPool({
    id: "hub-pool-live-2",
    title: "Random pool #2",
    status: { kind: "live" },
    tvl: "50.000$",
    expectedYield: "$5000",
    usersIn: 120,
    progressPercent: 72,
    remainingTime: { days: 0, hours: 3, minutes: 45, seconds: 8 },
    detail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS.slice(0, 3),
      walletBalance: "12000",
    },
  }),
  tagRandomPool({
    id: "hub-pool-ended-neutral",
    title: "Random pool #3",
    status: { kind: "ended" },
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    usersInPool: 101,
    progressPercent: 100,
    userWon: false,
    detail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS,
      winners: [
        { username: "Mizori", amount: "$333,33", avatarUrl: USDC_ICON_URL },
        { username: "Kisara", amount: "$333,33" },
        { username: "Tazumi", amount: "$333,34" },
      ],
    },
  }),
  tagRandomPool({
    id: "hub-pool-ended-won",
    title: "Random pool #4",
    status: { kind: "ended" },
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    usersInPool: 54,
    progressPercent: 100,
    userWon: true,
    detail: {
      participants: HUB_RANDOM_POOL_PARTICIPANT_MOCKS.slice(0, 4),
      winners: [
        { username: "Mizori", amount: "$333,33", avatarUrl: USDC_ICON_URL },
        { username: "Kisara", amount: "$333,33" },
        { username: "Tazumi", amount: "$333,34" },
      ],
    },
  }),
];

/** @deprecated Real RYD data is now sourced from `useRYDStore` via `rydDataToRandomPool`. */
export const PREDICTIONS_HUB_RANDOM_REWARD_CARD_MOCKS: PredictionsHubListItem[] =
  PREDICTIONS_HUB_RANDOM_POOL_MOCKS;

export const PREDICTIONS_HUB_CARD_MOCKS: PredictionsHubListItem[] = [
  ...PREDICTIONS_HUB_CRYPTO_CARD_MOCKS,
  ...PREDICTIONS_HUB_ESPORTS_CARD_MOCKS,
  ...PREDICTIONS_HUB_SPORT_CARD_MOCKS,
  ...PREDICTIONS_HUB_POLITICS_CARD_MOCKS,
  ...PREDICTIONS_HUB_FINANCE_CARD_MOCKS,
  ...PREDICTIONS_HUB_RANDOM_REWARD_CARD_MOCKS,
  ...PREDICTIONS_HUB_TECH_CARD_MOCKS,
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

function hubItemEndsAtMs(item: PredictionsHubListItem): number | null {
  if (item.endsAt == null) return null;
  return new Date(item.endsAt).getTime();
}

function matchesHubTimeFilter(
  item: PredictionsHubListItem,
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
  item: PredictionsHubListItem,
  filters: PredictionsHubFilterState,
): boolean {
  if (filters.marketTypeId === "all") return true;
  if (isCryptoPredictionCard(item)) {
    return getCryptoMarketType(item.predictionType) === filters.marketTypeId;
  }
  if (item.predictionType === "finance") {
    return filters.marketTypeId === "up_down";
  }
  return true;
}

function matchesHubEsportsGameFilter(
  item: PredictionsHubListItem,
  filters: PredictionsHubFilterState,
): boolean {
  if (filters.esportsGameId == null) return true;
  if (item.predictionType !== "esports") return true;
  return item.gameId === filters.esportsGameId;
}

function matchesHubSportDisciplineFilter(
  item: PredictionsHubListItem,
  filters: PredictionsHubFilterState,
): boolean {
  if (filters.sportDisciplineId == null) return true;
  if (item.predictionType !== "sport") return true;
  return item.disciplineId === filters.sportDisciplineId;
}

/** Applies hub filter state to mock feed items (hub page only). */
export function filterPredictionsHubCardMocks(
  items: PredictionsHubListItem[],
  filters: PredictionsHubFilterState,
  nowMs = Date.now(),
): PredictionsHubListItem[] {
  return items
    .filter((item) => predictionTypeMatchesHubCategory(item.predictionType, filters.categoryId))
    .filter((item) => matchesHubMarketTypeFilter(item, filters))
    .filter((item) => matchesHubEsportsGameFilter(item, filters))
    .filter((item) => matchesHubSportDisciplineFilter(item, filters))
    .filter((item) => matchesHubTimeFilter(item, filters.timeId, nowMs));
}

export function getPredictionsHubCardMocks(
  filters: PredictionsHubFilterState,
  nowMs = Date.now(),
): PredictionsHubListItem[] {
  return filterPredictionsHubCardMocks(PREDICTIONS_HUB_CARD_MOCKS, filters, nowMs);
}

/** Resolves a hub feed item by id (mocks until API). */
export function findPredictionsHubItemById(id: string): PredictionsHubListItem | undefined {
  return PREDICTIONS_HUB_CARD_MOCKS.find((item) => getPredictionsHubItemId(item) === id);
}

/** @deprecated Use `PredictionsHubListItem`. */
export type PredictionsHubItem = PredictionsHubListItem;
