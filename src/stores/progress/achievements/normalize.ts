import type { AchievementPublic, UserAchievementsResponse, UserAchievementView } from "@/shared/types/api";
import {
  readAchievementIconKey,
  readAchievementIconUrl,
} from "@/shared/utils/achievementMedia";

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function readString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return undefined;
}

function normalizeAchievementPublic(raw: unknown): AchievementPublic | null {
  if (raw == null || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const id = readString(record.id);
  const category = readString(record.category);
  const title = readString(record.title);
  const description = readString(record.description);

  if (id == null || category == null || title == null || description == null) return null;

  const targetValueRaw = record.targetValue ?? record.target_value;
  const targetValue =
    targetValueRaw == null
      ? null
      : (readNumber(targetValueRaw) ?? null);

  const xpRaw = record.xp ?? record.xpReward ?? record.xp_reward;
  const xp = xpRaw == null ? null : (readNumber(xpRaw) ?? null);

  return {
    id,
    category,
    title,
    description,
    targetValue,
    xp,
    iconUrl: readAchievementIconUrl(record) ?? null,
    iconKey: readAchievementIconKey(record) ?? null,
  };
}

/** Normalizes GET /achievements catalogue items. */
export function normalizeAchievementsCatalogue(raw: unknown): AchievementPublic[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map(normalizeAchievementPublic)
    .filter((item): item is AchievementPublic => item != null);
}

function normalizeUserAchievementView(raw: unknown): UserAchievementView | null {
  const definition = normalizeAchievementPublic(raw);
  if (definition == null || raw == null || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const status = readString(record.status);
  if (status !== "in_progress" && status !== "completed") return null;

  const currentValue = readNumber(record.currentValue) ?? readNumber(record.current_value) ?? 0;
  const xpAwarded = readNumber(record.xpAwarded) ?? readNumber(record.xp_awarded) ?? 0;
  const completedAt = readString(record.completedAt) ?? readString(record.completed_at) ?? null;

  return {
    ...definition,
    status,
    currentValue,
    xpAwarded,
    completedAt,
  };
}

/** Normalizes GET /achievements/me. */
export function normalizeUserAchievementsResponse(raw: unknown): UserAchievementsResponse {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    return { achievements: [], totalXp: 0 };
  }

  const record = raw as Record<string, unknown>;
  const achievementsRaw = record.achievements;
  const achievements = Array.isArray(achievementsRaw)
    ? achievementsRaw
        .map(normalizeUserAchievementView)
        .filter((item): item is NonNullable<typeof item> => item != null)
    : [];

  return {
    achievements,
    totalXp: readNumber(record.totalXp) ?? readNumber(record.total_xp) ?? 0,
    level: readNumber(record.level),
    currentXp: readNumber(record.currentXp) ?? readNumber(record.current_xp),
    xpToNextLevel: readNumber(record.xpToNextLevel) ?? readNumber(record.xp_to_next_level),
    description: readString(record.description) ?? null,
  };
}
