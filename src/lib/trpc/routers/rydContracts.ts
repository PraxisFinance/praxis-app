import { z } from "zod";
import { publicProcedure, router } from "../init";

export interface RydContractOffchainData {
  address: string;
  name: string;
  createdAt: string;
  endTime: string;
}

export const rydContractsRouter = router({
  byAddresses: publicProcedure
    .input(z.object({ addresses: z.array(z.string()) }))
    .query(async ({ ctx, input }): Promise<RydContractOffchainData[]> => {
      if (input.addresses.length === 0) return [];
      const rows = await ctx.db.rydContract.findMany({
        where: { address: { in: input.addresses } },
        select: {
          address: true,
          name: true,
          createdAt: true,
          endTime: true,
        },
      });
      return rows.map((r) => ({
        address: r.address,
        name: r.name,
        createdAt: r.createdAt.toISOString(),
        endTime: r.endTime.toISOString(),
      }));
    }),
});
