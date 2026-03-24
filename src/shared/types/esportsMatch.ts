import type { EsportsGameFilterId } from "@/shared/constants/esports";

/**
 * One side of an esports match (left / right on the card).
 * Odds are win coefficients for that team.
 */
export type EsportsMatchTeam = {
  name: string;
  logoUrl: string;
  /** Win coefficient (e.g. 1.35) */
  odds: number;
  /** Current or final map / round score; omit before the match starts */
  score?: number;
};

/**
 * Match lifecycle — drives status line (e.g. “Live now”, scheduled time, final).
 */
export type EsportsMatchStatus =
  | {
      kind: "live";
      /** UI label; default can be “Live now” in the component */
      label?: string;
    }
  | {
      kind: "upcoming";
      label?: string;
      /** ISO 8601 or API-defined display string for start time */
      startsAt?: string;
    }
  | {
      kind: "finished";
      label?: string;
    };

/**
 * Single match row for the esports list (card in the mock).
 * Game icon in the corner is resolved from `gameId` via `ESPORTS_GAMES`.
 */
export type EsportsMatch = {
  id: string;
  /** Which game — used for the corner icon from shared constants */
  gameId: EsportsGameFilterId;
  /** Link to the live stream (YouTube, Twitch, etc.); omit if no broadcast */
  streamUrl?: string;
  team1: EsportsMatchTeam;
  team2: EsportsMatchTeam;
  status: EsportsMatchStatus;
};
