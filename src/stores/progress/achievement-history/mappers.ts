import { ACHIEVEMENT_CATEGORIES_MOCK } from "@/shared/constants/achievements";
import type { AchievementItemIconId } from "@/shared/types/achievements";
import type {
  AchievementHistoryApiItem,
  AchievementHistoryApiResponse,
  AchievementHistoryItem,
} from "./types";

const ACHIEVEMENT_ICON_BY_ID: Record<string, AchievementItemIconId> = Object.fromEntries(
  ACHIEVEMENT_CATEGORIES_MOCK.flatMap((category) =>
    category.achievements.map((item) => [item.id, item.iconId]),
  ),
) as Record<string, AchievementItemIconId>;

export function mapHistoryApiItemToAchievementItem(
  item: AchievementHistoryApiItem,
): AchievementHistoryItem {
  return {
    id: item.id,
    iconId: ACHIEVEMENT_ICON_BY_ID[item.achievementId] ?? "trophy",
    title: item.title,
    description: item.description ?? "",
    xpReward: item.xpAwarded,
    status: "completed",
    completedAt: item.completedAt,
  };
}

export function mapHistoryApiResponse(
  response: AchievementHistoryApiResponse,
): AchievementHistoryItem[] {
  return (response.items ?? []).map(mapHistoryApiItemToAchievementItem);
}
