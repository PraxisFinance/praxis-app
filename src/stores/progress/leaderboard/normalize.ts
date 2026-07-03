import { deriveAccountLevelFromTotalXp, formatWalletDisplayName } from "@/shared/utils/achievementProgress";
import type { ProgressLeaderboardApiItem, ProgressLeaderboardApiResponse } from "./types";

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

function normalizeAddress(value: unknown): `0x${string}` {
  const address = readString(value);
  if (address?.startsWith("0x")) {
    return address.toLowerCase() as `0x${string}`;
  }

  return "0x0000000000000000000000000000000000000000";
}

function normalizeLeaderboardItem(
  raw: unknown,
  fallbackRank?: number,
): ProgressLeaderboardApiItem | null {
  if (raw == null || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;

  const rank =
    readNumber(record.rank) ??
    readNumber(record.place) ??
    readNumber(record.position) ??
    fallbackRank;
  const address = normalizeAddress(record.address ?? record.walletAddress ?? record.wallet);
  const score =
    readNumber(record.score) ??
    readNumber(record.points) ??
    readNumber(record.totalXp) ??
    readNumber(record.total_xp) ??
    readNumber(record.xp) ??
    0;
  const name =
    readString(record.name) ??
    readString(record.nickname) ??
    readString(record.displayName) ??
    readString(record.username) ??
    formatWalletDisplayName(address);
  const accountLevel =
    readNumber(record.accountLevel) ??
    readNumber(record.account_level) ??
    readNumber(record.level) ??
    deriveAccountLevelFromTotalXp(score);

  if (rank == null) return null;

  const id = readString(record.id) ?? address ?? `rank-${rank}`;

  return {
    id,
    rank,
    name,
    address,
    accountLevel,
    score,
  };
}

function extractLeaderboardEntries(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;

  if (raw == null || typeof raw !== "object") return [];

  const record = raw as Record<string, unknown>;
  const candidate =
    record.entries ??
    record.top ??
    record.leaderboard ??
    record.items ??
    record.users ??
    record.data;

  return Array.isArray(candidate) ? candidate : [];
}

function extractUserEntry(raw: unknown): unknown {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return null;

  const record = raw as Record<string, unknown>;

  return (
    record.caller ??
    record.userEntry ??
    record.user ??
    record.currentUser ??
    record.current_user ??
    record.me ??
    null
  );
}

/** Normalizes GET /achievements/leaderboard into the store contract. */
export function normalizeProgressLeaderboardResponse(raw: unknown): ProgressLeaderboardApiResponse {
  const entries = extractLeaderboardEntries(raw)
    .map((item, index) => normalizeLeaderboardItem(item, index + 1))
    .filter((item): item is ProgressLeaderboardApiItem => item != null);

  let userRank: number | null = null;

  if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>;
    userRank =
      readNumber(record.userRank) ??
      readNumber(record.user_rank) ??
      readNumber(record.myRank) ??
      readNumber(record.my_rank) ??
      null;
  }

  const userEntryRaw = extractUserEntry(raw);
  let userEntry: ProgressLeaderboardApiItem | null = null;

  if (userEntryRaw != null && typeof userEntryRaw === "object" && !Array.isArray(userEntryRaw)) {
    const userRecord = userEntryRaw as Record<string, unknown>;
    userEntry = normalizeLeaderboardItem(
      userRank != null && readNumber(userRecord.rank) == null
        ? { ...userRecord, rank: userRank }
        : userEntryRaw,
    );
  }

  if (userRank == null) {
    userRank = userEntry?.rank ?? null;
  }

  return {
    entries,
    userEntry,
    userRank,
  };
}
