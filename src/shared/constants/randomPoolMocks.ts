import type { RandomPool } from "@/shared/types/randomPool";

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
