/** Temporary UI mocks until achievements are wired to the API. */

import type { AchievementCategory, AchievementItem } from "@/shared/types/achievements";

export const ACHIEVEMENTS_COMMON_STATS_MOCK = {
  level: 1,
  currentXp: 50,
  xpToNextLevel: 100,
  description: "Upgrade your account and receive bonuses when you use the app.",
} as const;

export const ACHIEVEMENT_CATEGORIES_MOCK: AchievementCategory[] = [
  {
    id: "core-flow",
    label: "Core Flow",
    achievements: [
      {
        id: "core-first-deposit",
        title: "First deposit",
        description: "Make your first deposit to start earning yield.",
        xpReward: 25,
        status: "completed",
      },
      {
        id: "core-first-prediction",
        title: "First prediction",
        description: "Place your first prediction on any market.",
        xpReward: 25,
        status: "in_progress",
        progress: { current: 0, total: 1 },
      },
      {
        id: "core-profile-ready",
        title: "Profile ready",
        description: "Connect wallet and complete your profile setup.",
        xpReward: 15,
        status: "locked",
      },
    ],
  },
  {
    id: "referal",
    label: "Referal",
    achievements: [
      {
        id: "referal-first-friend",
        title: "Invite a friend",
        description: "Invite one friend who joins Praxis.",
        xpReward: 50,
        status: "locked",
      },
      {
        id: "referal-five-friends",
        title: "Community builder",
        description: "Invite five friends who join Praxis.",
        xpReward: 150,
        status: "locked",
      },
    ],
  },
  {
    id: "market-coverage",
    label: "Market Coverage",
    achievements: [
      {
        id: "market-crypto",
        title: "Crypto explorer",
        description: "Make a prediction in the crypto category.",
        xpReward: 20,
        status: "completed",
      },
      {
        id: "market-esports",
        title: "Esports fan",
        description: "Make a prediction in the esports category.",
        xpReward: 20,
        status: "locked",
      },
      {
        id: "market-finance",
        title: "Finance watcher",
        description: "Make a prediction in the finance category.",
        xpReward: 20,
        status: "locked",
      },
    ],
  },
  {
    id: "activity",
    label: "Activity",
    achievements: [
      {
        id: "activity-week-streak",
        title: "Weekly streak",
        description: "Use the app on 7 consecutive days.",
        xpReward: 40,
        status: "in_progress",
        progress: { current: 3, total: 7 },
      },
      {
        id: "activity-month-streak",
        title: "Monthly streak",
        description: "Use the app on 30 consecutive days.",
        xpReward: 120,
        status: "locked",
      },
    ],
  },
  {
    id: "yield-predictions",
    label: "Yield Predictions",
    achievements: [
      {
        id: "yield-first-stake",
        title: "First stake",
        description: "Stake assets in an available yield pool.",
        xpReward: 30,
        status: "completed",
      },
      {
        id: "yield-restake",
        title: "Compound gains",
        description: "Restake rewards from a yield position.",
        xpReward: 35,
        status: "locked",
      },
    ],
  },
  {
    id: "perfomance",
    label: "Perfomance",
    achievements: [
      {
        id: "perfomance-five-wins",
        title: "Sharp forecaster",
        description: "Win five resolved predictions.",
        xpReward: 60,
        status: "in_progress",
        progress: { current: 2, total: 5 },
      },
      {
        id: "perfomance-ten-wins",
        title: "Market master",
        description: "Win ten resolved predictions.",
        xpReward: 120,
        status: "locked",
      },
    ],
  },
  {
    id: "bonus",
    label: "Bonus",
    achievements: [
      {
        id: "bonus-launch",
        title: "Launch bonus",
        description: "Claim the welcome bonus during the launch period.",
        xpReward: 100,
        status: "locked",
      },
    ],
  },
];

export function getAchievementCategoryProgress(category: AchievementCategory): {
  completed: number;
  total: number;
} {
  const completed = category.achievements.filter((item) => item.status === "completed").length;
  return { completed, total: category.achievements.length };
}

export function getAchievementItemProgressPercent(item: AchievementItem): number | null {
  if (item.status !== "in_progress" || item.progress == null) return null;
  const { current, total } = item.progress;
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

export function getAchievementsLevelProgressPercent(currentXp: number, xpToNextLevel: number): number {
  if (xpToNextLevel <= 0) return 0;
  return Math.min(100, Math.max(0, (currentXp / xpToNextLevel) * 100));
}
