import { z } from "zod";
import { publicProcedure, router } from "../init";

export interface OffchainEventData {
  /** Value of `Event.contractEventId` (may be null for rows matched via `conditionId`). */
  contractEventId: string | null;
  /** Value of `Event.conditionId` (may be null for rows matched via `contractEventId`). */
  conditionId: string | null;
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

      return ctx.db.event.findMany({
        where: {
          contractEventId: { in: input.ids },
          ...(input.vault ? { vault: input.vault } : {}),
        },
        select: {
          contractEventId: true,
          conditionId: true,
          title: true,
          description: true,
          categories: true,
          votingDeadlineTs: true,
          expirationTimestamp: true,
          resolutionTypeTuple: true,
          logoPath: true,
        },
      });
    }),
});
