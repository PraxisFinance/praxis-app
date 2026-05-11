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
}

export const offchainEventsRouter = router({
  byContractIds: publicProcedure
    .input(z.object({ ids: z.array(z.string()), conditionIds: z.array(z.string()) }))
    .query(async ({ ctx, input }): Promise<OffchainEventData[]> => {
      if (input.ids.length === 0 && input.conditionIds.length === 0) return [];

      const orClauses = [
        ...(input.ids.length > 0 ? [{ contractEventId: { in: input.ids } }] : []),
        ...(input.conditionIds.length > 0 ? [{ conditionId: { in: input.conditionIds } }] : []),
      ];

      return ctx.db.event.findMany({
        where: { OR: orClauses },
        select: {
          contractEventId: true,
          conditionId: true,
          title: true,
          description: true,
          categories: true,
          votingDeadlineTs: true,
          expirationTimestamp: true,
          resolutionTypeTuple: true,
        },
      });
    }),
});
