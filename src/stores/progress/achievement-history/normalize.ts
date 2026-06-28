import type { AchievementHistoryApiItem, AchievementHistoryApiResponse } from "./types";

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function readString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value;
  return undefined;
}

function readNestedRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeHistoryItem(raw: unknown): AchievementHistoryApiItem | null {
  if (raw == null || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const achievement = readNestedRecord(record.achievement);

  const achievementId =
    readString(record.achievementId) ??
    readString(record.achievement_id) ??
    readString(achievement?.id);
  const id = readString(record.id) ?? achievementId;
  const title =
    readString(record.title) ??
    readString(record.name) ??
    readString(record.achievementTitle) ??
    readString(achievement?.title) ??
    "Achievement";
  const completedAt =
    readString(record.completedAt) ??
    readString(record.completed_at) ??
    readString(record.createdAt) ??
    readString(record.created_at) ??
    readString(record.timestamp) ??
    readString(record.occurredAt);

  if (id == null && achievementId == null) return null;

  const xpAwarded =
    readNumber(record.xpAwarded) ??
    readNumber(record.xp_awarded) ??
    readNumber(record.xp) ??
    readNumber(record.amount) ??
    0;

  return {
    id: id ?? achievementId!,
    achievementId: achievementId ?? id!,
    title,
    description: readString(record.description) ?? readString(achievement?.description),
    xpAwarded,
    completedAt: completedAt ?? new Date(0).toISOString(),
  };
}

function extractHistoryItems(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;

  if (raw == null || typeof raw !== "object") return [];

  const record = raw as Record<string, unknown>;
  const candidate = record.items ?? record.history ?? record.entries ?? record.data;

  return Array.isArray(candidate) ? candidate : [];
}

/** Normalizes flexible backend shapes into the store contract. */
export function normalizeAchievementHistoryResponse(raw: unknown): AchievementHistoryApiResponse {
  const items = extractHistoryItems(raw)
    .map(normalizeHistoryItem)
    .filter((item): item is AchievementHistoryApiItem => item != null);

  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    return { items };
  }

  const record = raw as Record<string, unknown>;

  return {
    items,
    page: readNumber(record.page),
    pageSize: readNumber(record.pageSize) ?? readNumber(record.limit),
    total: readNumber(record.total),
    hasMore: typeof record.hasMore === "boolean" ? record.hasMore : undefined,
  };
}
