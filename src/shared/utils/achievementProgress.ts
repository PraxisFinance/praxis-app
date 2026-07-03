export const ACHIEVEMENT_XP_PER_LEVEL = 100;

export function deriveProgressStatsFromTotalXp(totalXp: number): {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
} {
  const xpToNextLevel = ACHIEVEMENT_XP_PER_LEVEL;
  const safeTotalXp = Math.max(0, totalXp);
  const level = Math.floor(safeTotalXp / xpToNextLevel) + 1;
  const currentXp = safeTotalXp % xpToNextLevel;

  return { level, currentXp, xpToNextLevel };
}

export function deriveAccountLevelFromTotalXp(totalXp: number): number {
  return deriveProgressStatsFromTotalXp(totalXp).level;
}

export function formatWalletDisplayName(address: `0x${string}`): string {
  if (address === "0x0000000000000000000000000000000000000000") {
    return "Unknown";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
