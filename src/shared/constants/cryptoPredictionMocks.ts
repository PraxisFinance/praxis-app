import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";

function isoInHours(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

/** Пока нет ассетов по тикерам — один общий плейсхолдер из `public/`. */
const MOCK_ICON = "/icons/usdc.png";

/**
 * Примеры карточек для верстки и фильтров; даты относительные, чтобы «Live» и «End in» выглядели правдоподобно.
 */
export const CRYPTO_PREDICTION_MOCKS: CryptoPrediction[] = [
  {
    id: "aero-updown-live",
    cpfPoolId: BigInt(1),
    title: "AERO Up or Down",
    assetSymbol: "AERO",
    iconUrl: MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: isoInHours(6),
    predictionType: "up_down",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", odds: 1.72, poolPercent: 65 },
      { id: "down", label: "Down", odds: 2.05, poolPercent: 35 },
    ],
  },
  {
    id: "eth-updown-upcoming",
    cpfPoolId: BigInt(2),
    title: "ETH Up or Down",
    assetSymbol: "ETH",
    iconUrl: MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(2) },
    endsAt: isoInHours(30),
    predictionType: "up_down",
    isTradingOpen: true,
    outcomes: [
      { id: "up", label: "Up", odds: 1.9, poolPercent: 52 },
      { id: "down", label: "Down", odds: 1.95, poolPercent: 48 },
    ],
  },
  {
    id: "sol-above-below",
    cpfPoolId: BigInt(3),
    title: "SOL above key levels",
    assetSymbol: "SOL",
    iconUrl: MOCK_ICON,
    status: { kind: "live" },
    endsAt: isoInHours(18),
    predictionType: "above_below",
    isTradingOpen: true,
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
    id: "btc-range",
    cpfPoolId: BigInt(4),
    title: "BTC price range (Feb close)",
    assetSymbol: "BTC",
    iconUrl: MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(12) },
    endsAt: isoInHours(72),
    predictionType: "price_range",
    isTradingOpen: true,
    lowerBoundLabel: "$92,000",
    upperBoundLabel: "$98,000",
    outcomes: [
      { id: "inside", label: "Inside range", odds: 1.85, poolPercent: 54 },
      { id: "outside", label: "Outside range", odds: 1.92, poolPercent: 46 },
    ],
  },
  {
    id: "hype-hit",
    cpfPoolId: BigInt(5),
    title: "HYPE hits target",
    assetSymbol: "HYPE",
    iconUrl: MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(6) },
    endsAt: isoInHours(48),
    predictionType: "hit",
    isTradingOpen: true,
    targetPriceLabel: "$25.00",
    outcomes: [
      { id: "hit", label: "Hit", odds: 2.4, poolPercent: 38 },
      { id: "miss", label: "Miss", odds: 1.52, poolPercent: 62 },
    ],
  },
  {
    id: "link-ended",
    cpfPoolId: BigInt(6),
    title: "LINK Up or Down",
    assetSymbol: "LINK",
    iconUrl: MOCK_ICON,
    status: {
      kind: "ended",
      resolutionSummary: "Resolved Down",
      endedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    endsAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    predictionType: "up_down",
    isTradingOpen: false,
    outcomes: [
      { id: "up", label: "Up", odds: 1.5, poolPercent: 40 },
      { id: "down", label: "Down", odds: 2.2, poolPercent: 60 },
    ],
  },
];
