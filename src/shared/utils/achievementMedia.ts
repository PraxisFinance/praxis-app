import {
  isAchievementItemIconId,
  resolveAchievementIconIdFromSlug,
} from "@/shared/utils/achievementIcons";
import type { AchievementItemIconId } from "@/shared/types/achievements";
import { resolveAchievementCategoryId } from "@/shared/constants/achievementCategoryMeta";
import type { AchievementCategoryId } from "@/shared/types/achievements";

const CATEGORY_DEFAULT_ICON: Record<AchievementCategoryId, AchievementItemIconId> = {
  "core-flow": "deposit",
  referal: "invite",
  "market-coverage": "chart",
  activity: "calendar",
  "yield-predictions": "stake",
  perfomance: "target",
  bonus: "gift",
};

function readString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return undefined;
}

function looksLikeUrl(value: string): boolean {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:")
  );
}

/** Resolves relative media paths against `NEXT_PUBLIC_MEDIA_URL`. */
export function resolveAchievementMediaUrl(value: string | undefined): string | undefined {
  if (value == null || value === "") return undefined;

  if (looksLikeUrl(value)) return value;

  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "");
  if (mediaBase == null || mediaBase === "") return value;

  return `${mediaBase}/${value.replace(/^\//, "")}`;
}

export function readAchievementIconUrl(source: Record<string, unknown>): string | undefined {
  const raw =
    readString(source.iconUrl) ??
    readString(source.icon_url) ??
    readString(source.imgSrc) ??
    readString(source.img_src) ??
    readString(source.imageUrl) ??
    readString(source.image_url) ??
    readString(source.image) ??
    readString(source.logoUrl) ??
    readString(source.logo_url);

  if (raw != null) {
    return resolveAchievementMediaUrl(raw);
  }

  const icon = readString(source.icon);
  if (icon != null && looksLikeUrl(icon)) {
    return resolveAchievementMediaUrl(icon);
  }

  return undefined;
}

export function readAchievementIconKey(source: Record<string, unknown>): string | undefined {
  const explicit =
    readString(source.iconKey) ??
    readString(source.icon_key) ??
    readString(source.iconId) ??
    readString(source.icon_id);

  if (explicit != null) return explicit;

  const icon = readString(source.icon);
  if (icon != null && !looksLikeUrl(icon)) return icon;

  return undefined;
}

export function resolveAchievementVisuals(input: {
  achievementId: string;
  category?: string | null;
  iconUrl?: string | null;
  iconKey?: string | null;
}): { iconId: AchievementItemIconId; iconUrl?: string } {
  const iconUrl = resolveAchievementMediaUrl(input.iconUrl ?? undefined);
  const iconKey = input.iconKey ?? undefined;

  if (iconKey != null && isAchievementItemIconId(iconKey)) {
    return { iconId: iconKey, iconUrl };
  }

  const categoryId =
    input.category != null ? resolveAchievementCategoryId(input.category) : null;
  const iconId =
    (categoryId != null ? CATEGORY_DEFAULT_ICON[categoryId] : undefined) ??
    resolveAchievementIconIdFromSlug(input.achievementId);

  return { iconId, iconUrl };
}
