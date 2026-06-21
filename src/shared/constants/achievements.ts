/** Temporary UI mocks until achievements are wired to the API. */

export const ACHIEVEMENTS_COMMON_STATS_MOCK = {
  level: 1,
  currentXp: 50,
  xpToNextLevel: 100,
  description: "Upgrade your account and receive bonuses when you use the app.",
} as const;

export function getAchievementsLevelProgressPercent(currentXp: number, xpToNextLevel: number): number {
  if (xpToNextLevel <= 0) return 0;
  return Math.min(100, Math.max(0, (currentXp / xpToNextLevel) * 100));
}
