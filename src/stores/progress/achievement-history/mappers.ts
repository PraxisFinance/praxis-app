import type { AchievementItem } from "@/shared/types/achievements";
import type { AchievementHistoryApiItem, AchievementHistoryApiResponse } from "./types";

export function mapHistoryApiItemToAchievementItem(item: AchievementHistoryApiItem): AchievementItem {
  return {
    id: item.id,
    iconId: "trophy",
    title: item.title,
    description: item.description ?? "",
    xpReward: item.xpAwarded,
    status: "completed",
  };
}

export function mapHistoryApiResponse(response: AchievementHistoryApiResponse): AchievementItem[] {
  return response.items.map(mapHistoryApiItemToAchievementItem);
}
