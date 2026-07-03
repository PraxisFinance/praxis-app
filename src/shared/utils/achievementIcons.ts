import type { AchievementItemIconId } from "@/shared/types/achievements";

const ACHIEVEMENT_ITEM_ICON_IDS = new Set<AchievementItemIconId>([
  "dice",
  "chart",
  "deposit",
  "prediction",
  "profile",
  "wallet",
  "yield",
  "trophy",
  "invite",
  "crypto",
  "esports",
  "finance",
  "calendar",
  "stake",
  "target",
  "gift",
]);

export function isAchievementItemIconId(value: string): value is AchievementItemIconId {
  return ACHIEVEMENT_ITEM_ICON_IDS.has(value as AchievementItemIconId);
}

export function resolveAchievementIconIdFromSlug(achievementId: string): AchievementItemIconId {
  const slug = achievementId.toLowerCase();

  if (slug.includes("deposit") || slug.includes("claim")) return "deposit";
  if (slug.includes("wallet") || slug.includes("connect")) return "wallet";
  if (slug.includes("withdraw")) return "wallet";
  if (slug.includes("sport")) return "esports";
  if (slug.includes("finance") || slug.includes("financial")) return "finance";
  if (slug.includes("crypto")) return "crypto";
  if (slug.includes("random") || slug.includes("dice")) return "dice";
  if (slug.includes("predict")) return "prediction";
  if (slug.includes("invite") || slug.includes("refer")) return "invite";
  if (slug.includes("stake") || slug.includes("yield")) return "yield";
  if (slug.includes("leaderboard")) return "trophy";
  if (slug.includes("profile")) return "profile";
  if (slug.includes("gift") || slug.includes("bonus")) return "gift";

  return "trophy";
}
