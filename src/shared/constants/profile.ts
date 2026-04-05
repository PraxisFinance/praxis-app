import type {
  PredictionHistoryItem,
  PredictionsHistoryInterval,
  PredictionsOverallStatsData,
  PredictionsStatsDataPoint,
  PredictionsStatsInterval,
  PredictionsStatsLineMeta,
  RewardClaimItem,
  ProfilePredictionItem,
  ProfilePredictionStatusFilter,
  ProfilePredictionTimeInterval,
} from "@/shared/types/profile";

// ── Predictions stats chart ────────────────────────────────────────────────

export const PREDICTIONS_STATS_INTERVALS: { id: PredictionsStatsInterval; label: string }[] = [
  { id: "1D", label: "1 day" },
  { id: "3D", label: "3 days" },
  { id: "7D", label: "7 days" },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year" },
];

export const PREDICTIONS_STATS_LINE_META: PredictionsStatsLineMeta[] = [
  { key: "count", label: "Total", color: "#9787f4" },
  { key: "win", label: "Won", color: "#34C53E" },
  { key: "lost", label: "Lost", color: "#ff5858" },
];

// ── Mock data ─────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Builds a random-walk series guaranteed to stay >= 0. */
function randomWalk(
  n: number,
  start: number,
  volatility: number,
  drift: number,
  seed: number
): number[] {
  const rng = makeRng(seed);
  const out: number[] = [start];
  for (let i = 1; i < n; i++) {
    const step = (rng() - 0.5) * 2 * volatility + drift;
    out.push(Math.max(0, Math.round(out[i - 1] + step)));
  }
  return out;
}

/** win + lost are independently walked but clamped to count. */
function buildStatsPoints(
  dates: string[],
  countSeed: number,
  winSeed: number,
  lostSeed: number,
  base: number,
  vol: number
): PredictionsStatsDataPoint[] {
  const n = dates.length;
  const counts = randomWalk(n, base, vol, 0.3, countSeed);
  const wins = randomWalk(n, Math.round(base * 0.55), vol * 0.6, 0.2, winSeed);
  const losts = randomWalk(n, Math.round(base * 0.3), vol * 0.4, 0.1, lostSeed);
  return dates.map((date, i) => ({
    date,
    count: counts[i],
    win: Math.min(wins[i], counts[i]),
    lost: Math.min(losts[i], counts[i] - Math.min(wins[i], counts[i])),
  }));
}

const mock1D = buildStatsPoints(
  Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
  11,
  22,
  33,
  8,
  3
);
const mock3D = buildStatsPoints(
  Array.from({ length: 12 }, (_, i) => {
    const d = Math.floor(i / 4) + 1;
    const h = (i % 4) * 6;
    return `D${d} ${String(h).padStart(2, "0")}h`;
  }),
  44,
  55,
  66,
  20,
  7
);
const mock7D = buildStatsPoints(
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  77,
  88,
  99,
  35,
  12
);
const mock1M = buildStatsPoints(
  Array.from({ length: 10 }, (_, i) => `Mar ${i * 3 + 1}`),
  111,
  222,
  333,
  60,
  20
);
const mock1Y = buildStatsPoints(
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  444,
  555,
  666,
  100,
  35
);

export const PREDICTIONS_STATS_MOCK_DATA: Record<
  PredictionsStatsInterval,
  PredictionsStatsDataPoint[]
> = {
  "1D": mock1D,
  "3D": mock3D,
  "7D": mock7D,
  "1M": mock1M,
  "1Y": mock1Y,
};

// ── Predictions overall stats ──────────────────────────────────────────────

export const PREDICTIONS_OVERALL_STATS_MOCK: PredictionsOverallStatsData = {
  matchStats: [
    { kind: "won", label: "Won matches", value: 101 },
    { kind: "lost", label: "Lose matches", value: 54 },
    { kind: "pending", label: "Pending matches", value: 15 },
  ],
  currencyStats: [
    { kind: "won", label: "Won currency", amount: 1000, currency: "$wUSDC" },
    { kind: "lost", label: "Lost currency", amount: 500, currency: "$wUSDC" },
  ],
};

// ── Predictions history ────────────────────────────────────────────────────

export const PREDICTIONS_HISTORY_INTERVALS: { id: PredictionsHistoryInterval; label: string }[] = [
  { id: "1D", label: "1 day" },
  { id: "3D", label: "3 days" },
  { id: "7D", label: "7 days" },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year" },
];

type RawItem = [PredictionHistoryItem["result"], string, string, number];

function makeItems(rows: RawItem[], currency = "$USDC"): PredictionHistoryItem[] {
  return rows.map(([result, prediction, date, amount], i) => ({
    id: `${date}-${i}`,
    result,
    prediction,
    date,
    amount,
    currency,
  }));
}

export const PREDICTIONS_HISTORY_MOCK_DATA: Record<
  PredictionsHistoryInterval,
  PredictionHistoryItem[]
> = {
  "1D": makeItems([
    ["won", "BTC/USDC", "30/03/26", 25],
    ["lost", "ETH/USDC", "30/03/26", 101],
    ["won", "BTC/USDC", "30/03/26", 50],
    ["lost", "SOL/USDC", "30/03/26", 10],
    ["won", "ETH/USDC", "30/03/26", 75],
  ]),
  "3D": makeItems([
    ["won", "BTC/USDC", "30/03/26", 25],
    ["lost", "Match#2", "29/03/26", 101],
    ["won", "ETH/USDC", "29/03/26", 50],
    ["lost", "SOL/USDC", "29/03/26", 10],
    ["won", "BTC/USDC", "28/03/26", 75],
    ["lost", "Match#6", "28/03/26", 30],
    ["won", "ETH/USDC", "28/03/26", 20],
  ]),
  "7D": makeItems([
    ["won", "BTC/USDC", "30/03/26", 25],
    ["lost", "Match#2", "29/03/26", 101],
    ["won", "ETH/USDC", "28/03/26", 50],
    ["won", "SOL/USDC", "27/03/26", 200],
    ["lost", "BTC/USDC", "26/03/26", 10],
    ["won", "Match#6", "25/03/26", 75],
    ["lost", "ETH/USDC", "25/03/26", 30],
    ["won", "BTC/USDC", "24/03/26", 60],
    ["lost", "SOL/USDC", "24/03/26", 15],
  ]),
  "1M": makeItems([
    ["won", "BTC/USDC", "30/03/26", 25],
    ["lost", "Match#2", "27/03/26", 101],
    ["won", "ETH/USDC", "24/03/26", 50],
    ["lost", "SOL/USDC", "21/03/26", 10],
    ["won", "BTC/USDC", "18/03/26", 200],
    ["won", "Match#6", "15/03/26", 75],
    ["lost", "ETH/USDC", "12/03/26", 30],
    ["won", "SOL/USDC", "09/03/26", 60],
    ["lost", "BTC/USDC", "06/03/26", 15],
    ["won", "Match#10", "03/03/26", 40],
    ["lost", "ETH/USDC", "01/03/26", 90],
  ]),
  "1Y": makeItems([
    ["won", "BTC/USDC", "Mar 26", 250],
    ["lost", "Match#2", "Feb 26", 101],
    ["won", "ETH/USDC", "Jan 26", 500],
    ["lost", "SOL/USDC", "Dec 25", 10],
    ["won", "BTC/USDC", "Nov 25", 200],
    ["won", "Match#6", "Oct 25", 75],
    ["lost", "ETH/USDC", "Sep 25", 30],
    ["won", "SOL/USDC", "Aug 25", 600],
    ["lost", "BTC/USDC", "Jul 25", 15],
    ["won", "Match#10", "Jun 25", 400],
    ["lost", "ETH/USDC", "May 25", 90],
    ["won", "BTC/USDC", "Apr 25", 1000],
  ]),
};

// ── Rewards claims ─────────────────────────────────────────────────────────

export const REWARDS_CLAIMS_MOCK: RewardClaimItem[] = [
  { id: "1", name: "Steakhouse USDT", iconUrl: "/icons/usdc.png", income: 500, incomeCurrency: "ytPraxis" },
  { id: "2", name: "Match: AVULUS", iconUrl: "/icons/w-usdc.png", income: 5, incomeCurrency: "ytPraxis" },
  { id: "3", name: "Random pool #1", iconUrl: "/icons/yt-token.png", income: 35, incomeCurrency: "ytPraxis" },
  { id: "4", name: "AERO Up or Down: Up", iconUrl: "/icons/w-usdc.png", income: 15, incomeCurrency: "ytPraxis" },
];

// ── Profile predictions ────────────────────────────────────────────────────

export const PROFILE_PREDICTION_STATUS_FILTERS: {
  id: ProfilePredictionStatusFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "complete", label: "Complete" },
  { id: "in_progress", label: "In Progress" },
];

export const PROFILE_PREDICTION_TIME_INTERVALS: {
  id: ProfilePredictionTimeInterval;
  label: string;
}[] = [
  { id: "1D", label: "24h" },
  { id: "3D", label: "3 days" },
  { id: "7D", label: "7 days" },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year" },
];

export const PROFILE_PREDICTIONS_MOCK: ProfilePredictionItem[] = [
  {
    id: "pp1",
    kind: "pool",
    name: "Random pool #3",
    iconUrl: "/icons/yt-token.png",
    ended: true,
    userWon: false,
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    progressPercent: 100,
  },
  {
    id: "pp2",
    kind: "pool",
    name: "Random pool #4",
    iconUrl: "/icons/yt-token.png",
    ended: true,
    userWon: true,
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    progressPercent: 100,
  },
  {
    id: "pp3",
    kind: "match",
    name: "Match outcome: AVULUS",
    iconUrl: "/icons/w-usdc.png",
    ended: true,
    userWon: true,
    coeff: 3.4,
    prediction: "$294 wUSDC",
    earnings: "$1000 wUSDC",
  },
  {
    id: "pp4",
    kind: "pool",
    name: "Random pool #5",
    iconUrl: "/icons/yt-token.png",
    ended: false,
    userWon: false,
    tvl: "54.500$",
    earnings: "$320",
    usersWon: 0,
    progressPercent: 62,
  },
  {
    id: "pp5",
    kind: "match",
    name: "Match outcome: Chelsea",
    iconUrl: "/icons/w-usdc.png",
    ended: false,
    userWon: false,
    coeff: 2.1,
    prediction: "$150 wUSDC",
    earnings: "$315 wUSDC",
  },
];
