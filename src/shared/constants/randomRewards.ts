import type { RandomPool, RandomPoolUserInPool } from "@/shared/types/randomPool";

export const RANDOM_REWARDS_FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "ended", label: "Ended" },
  { id: "1h", label: "1h" },
  { id: "12h", label: "12h" },
  { id: "1d", label: "1d" },
  { id: "1w", label: "1w" },
] as const;

export type RandomRewardsFilterId = (typeof RANDOM_REWARDS_FILTERS)[number]["id"];

/** Copy for the “Random pools” help drawer */
export const RANDOM_POOLS_HINT = {
  title: "How it works?",
  description:
    "Users stake their YT into one pool, and at the end of the game period, 3 random users divide the PnL amount between themselves.",
} as const;

/** Default currency icon for pool user amounts when `currencyIconUrl` is not set */
export const DEFAULT_POOL_USER_CURRENCY_ICON_URL = "/icons/w-usdc.png";

/** Mock users shown on pool details (until API exists). */
export const MOCK_USERS_IN_POOL: RandomPoolUserInPool[] = [
  { username: "Mizori", amount: "$1000", avatarUrl: "/icons/usdc.png" },
  { username: "Kisara", amount: "$1500" },
  { username: "Tazumi", amount: "$800", avatarUrl: "/icons/question.png" },
  { username: "Rinara", amount: "$2200", currencyIconUrl: "/icons/yt-token.png" },
  { username: "Yoshiko", amount: "$500" },
];

/** Mock pools covering all UI states from design */
export const RANDOM_POOL_MOCKS: RandomPool[] = [
  {
    id: "pool-live-1",
    title: "Random pool #1",
    iconUrl: "/icons/question.png",
    status: "live",
    tvl: "10.000$",
    expectedYield: "$1000",
    usersIn: 25,
    progressPercent: 45,
    remainingTime: { days: 2, hours: 5, minutes: 12, seconds: 33 },
  },
  {
    id: "pool-live-2",
    title: "Random pool #2",
    status: "live",
    tvl: "50.000$",
    expectedYield: "$5000",
    usersIn: 120,
    progressPercent: 72,
    remainingTime: { days: 0, hours: 3, minutes: 45, seconds: 8 },
  },
  {
    id: "pool-ended-neutral",
    title: "Random pool #3",
    status: "ended",
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    progressPercent: 100,
    userWon: false,
  },
  {
    id: "pool-ended-won",
    title: "Random pool #4",
    status: "ended",
    tvl: "100.000$",
    earnings: "$1000",
    usersWon: 3,
    progressPercent: 100,
    userWon: true,
  },
];
