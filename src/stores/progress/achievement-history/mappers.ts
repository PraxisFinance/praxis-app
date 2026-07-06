import { resolveAchievementVisuals } from "@/shared/utils/achievementMedia";
import type { AchievementPublic } from "@/shared/types/api";
import type {
  AchievementHistoryApiItem,
  AchievementHistoryApiResponse,
  AchievementHistoryItem,
} from "./types";

export function mapHistoryApiItemToAchievementItem(
  item: AchievementHistoryApiItem,
  definition?: AchievementPublic,
): AchievementHistoryItem {
  const { iconId, iconUrl } = resolveAchievementVisuals({
    achievementId: item.achievementId,
    category: definition?.category,
    iconUrl: item.iconUrl ?? definition?.iconUrl,
    iconKey: item.iconKey ?? definition?.iconKey,
  });

  return {
    id: item.id,
    iconId,
    iconUrl: iconUrl ?? item.iconUrl ?? definition?.iconUrl,
    title: item.title,
    description: item.description ?? definition?.description ?? "",
    xpReward: item.xpAwarded,
    status: "completed",
    completedAt: item.completedAt,
  };
}

export function mapHistoryApiResponse(
  response: AchievementHistoryApiResponse,
  definitions: AchievementPublic[] | null = null,
): AchievementHistoryItem[] {
  const definitionById = new Map((definitions ?? []).map((definition) => [definition.id, definition]));

  return (response.items ?? []).map((item) =>
    mapHistoryApiItemToAchievementItem(item, definitionById.get(item.achievementId)),
  );
}
