import { create } from "zustand";

// ── Oracle price (fully typed by backend spec) ────────────────────────

export interface OraclePriceData {
  marketAddress: string | null;
  marketSlug: string;
  source: string;
  timestamp: number;
  value: number;
}

// ── Live match score ──────────────────────────────────────────────────

export interface LiveMatchScore {
  /** Home / side-A score. */
  scoreA: number;
  /** Away / side-B score. */
  scoreB: number;
  /** Match status string (e.g. "live", "halftime"). */
  status?: string;
  /** Whether the match has concluded. */
  isFinished: boolean;
  /** Epoch ms when this update was received by the client. */
  updatedAt: number;
}

/**
 * Shape of each entry inside the `live_sports_update` / `live_esports_update`
 * payload. The full payload is `Record<matchId, LiveMatchEntry>`.
 */
interface LiveMatchEntry {
  matchId: number | string;
  matchScore?: { home?: number | null; away?: number | null };
  status?: string;
  isFinished?: boolean;
}

function parseEntry(entry: LiveMatchEntry): LiveMatchScore {
  return {
    scoreA: entry.matchScore?.home ?? 0,
    scoreB: entry.matchScore?.away ?? 0,
    status: entry.status,
    isFinished: entry.isFinished ?? false,
    updatedAt: Date.now(),
  };
}

/**
 * Processes a raw `live_sports_update` / `live_esports_update` payload.
 * The payload is `Record<matchId, { matchId, matchScore, status, isFinished }>`.
 * Returns a partial update for the store (keyed by `matchId.toString()`).
 */
function processMatchMapPayload(
  raw: Record<string, unknown>,
): Record<string, LiveMatchScore> {
  const result: Record<string, LiveMatchScore> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value !== "object" || value === null) continue;
    const entry = value as Record<string, unknown>;
    const rawMatchId = entry.matchId;
    const idStr =
      typeof rawMatchId === "number" || typeof rawMatchId === "string"
        ? String(rawMatchId)
        : key;
    const matchScore =
      typeof entry.matchScore === "object" && entry.matchScore !== null
        ? (entry.matchScore as { home?: number | null; away?: number | null })
        : undefined;

    result[idStr] = parseEntry({
      matchId: idStr,
      matchScore,
      status: typeof entry.status === "string" ? entry.status : undefined,
      isFinished: typeof entry.isFinished === "boolean" ? entry.isFinished : false,
    });
  }
  return result;
}

// ── Store ─────────────────────────────────────────────────────────────

interface LiveDataState {
  /**
   * Live sport match scores keyed by external `matchId` (as string).
   * Populated from `live_sports_update` events.
   */
  sportScores: Record<string, LiveMatchScore>;
  /**
   * Live esports match scores keyed by external `matchId` (as string).
   * Populated from `live_esports_update` events.
   */
  esportsScores: Record<string, LiveMatchScore>;
  /**
   * Oracle prices keyed by `marketSlug`.
   * Also indexed by lowercase `marketAddress` when provided.
   */
  oraclePrices: Record<string, OraclePriceData>;

  sourceConnected: boolean;
  marketsConnected: boolean;

  /**
   * Called by the source socket handler on `live_sports_update`.
   * Payload: `Record<matchId, { matchId, matchScore, status, isFinished }>`.
   */
  handleSportUpdate: (raw: Record<string, unknown>) => void;
  /**
   * Called by the source socket handler on `live_esports_update`.
   * Same payload shape as sport.
   */
  handleEsportsUpdate: (raw: Record<string, unknown>) => void;
  /** Called by the markets socket handler on `oraclePriceData`. */
  handleOraclePriceData: (data: OraclePriceData) => void;

  setSourceConnected: (connected: boolean) => void;
  setMarketsConnected: (connected: boolean) => void;
}

type MatchScoreField = "sportScores" | "esportsScores";

export const useLiveDataStore = create<LiveDataState>((set) => {
  /** Shared by `handleSportUpdate` / `handleEsportsUpdate` — same payload shape, different field. */
  const applyMatchUpdate = (field: MatchScoreField, raw: Record<string, unknown>) => {
    const updates = processMatchMapPayload(raw);
    if (Object.keys(updates).length === 0) return;
    set((s) => ({ [field]: { ...s[field], ...updates } }));
  };

  return {
    sportScores: {},
    esportsScores: {},
    oraclePrices: {},
    sourceConnected: false,
    marketsConnected: false,

    handleSportUpdate: (raw) => applyMatchUpdate("sportScores", raw),
    handleEsportsUpdate: (raw) => applyMatchUpdate("esportsScores", raw),

    handleOraclePriceData: (data) => {
      set((s) => {
        const next = { ...s.oraclePrices, [data.marketSlug]: data };
        if (data.marketAddress) {
          next[data.marketAddress.toLowerCase()] = data;
        }
        return { oraclePrices: next };
      });
    },

    setSourceConnected: (connected) => set({ sourceConnected: connected }),
    setMarketsConnected: (connected) => set({ marketsConnected: connected }),
  };
});
