import { z } from "zod";
import { publicProcedure, router } from "../init";

/** Flat JSON object — only fields relevant to the selected `category` + `resolutionType` are present. */
export interface EventMetadata {
  // ── crypto ──────────────────────────────────────────────────────────
  assetSymbol?: string;
  resolutionAssetLabel?: string;
  resolutionReferenceDateLabel?: string;
  // ── finance ─────────────────────────────────────────────────────────
  assetName?: string;
  assetTicker?: string;
  resolutionSourceLabel?: string;
  // ── esports / sport ─────────────────────────────────────────────────
  gameId?: "dota2" | "csgo" | "lol" | "valorant" | "cod";
  teamAName?: string;
  teamALogoUrl?: string;
  teamBName?: string;
  teamBLogoUrl?: string;
  streamUrl?: string;
}

export interface OffchainEventData {
  /** Value of `Event.contractEventId` (may be null for rows matched via `conditionId`). */
  contractEventId: string | null;
  /** Value of `Event.conditionId` (may be null for rows matched via `contractEventId`). */
  conditionId: string | null;
  /**
   * Upstream provider's identifier for this event (e.g. a match ID from a
   * sports/esports data feed). Used to correlate `live_sports_update` /
   * `live_esports_update` WebSocket payloads with this market.
   */
  sourceId: string | null;
  title: string;
  description: string | null;
  categories: string[];
  /** Unix seconds — when the lock period starts (voting / trading closes). */
  votingDeadlineTs: number | null;
  /** Unix seconds — when the lock period ends; after this, if the pool is still Open on-chain, resolution is in progress. */
  expirationTimestamp: number | null;
  /** Matches `RESOLUTION_TUPLES[].value` when set — drives outcome button copy. */
  resolutionTypeTuple: string | null;
  /** Full URL to the event logo stored on R2 (e.g. https://media.praxis.cc/market-logos/…). */
  logoPath: string | null;
  eventType: string | null;
  category: string | null;
  resolutionType: string | null;
  sideALabel: string | null;
  sideBLabel: string | null;
  metadata: EventMetadata | null;
}

export const offchainEventsRouter = router({
  byContractIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        vault: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }): Promise<OffchainEventData[]> => {
      if (input.ids.length === 0) return [];

      const rows = await ctx.db.event.findMany({
        where: {
          contractEventId: { in: input.ids },
          ...(input.vault ? { vault: input.vault } : {}),
        },
        select: {
          contractEventId: true,
          conditionId: true,
          sourceId: true,
          title: true,
          description: true,
          categories: true,
          votingDeadlineTs: true,
          expirationTimestamp: true,
          resolutionTypeTuple: true,
          logoPath: true,
          eventType: true,
          category: true,
          resolutionType: true,
          sideALabel: true,
          sideBLabel: true,
          metadata: true,
        },
      });

      return rows.map((r) => ({
        ...r,
        metadata: r.metadata as EventMetadata | null,
      }));
    }),
});
