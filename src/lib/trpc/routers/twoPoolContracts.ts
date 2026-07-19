import { z } from "zod";
import { publicProcedure, router } from "../init";

export interface TwoPoolContractOffchainData {
  address: string;
  name: string;
  description: string | null;
}

export const twoPoolContractsRouter = router({
  byAddresses: publicProcedure
    .input(z.object({ addresses: z.array(z.string()) }))
    .query(async ({ ctx, input }): Promise<TwoPoolContractOffchainData[]> => {
      if (input.addresses.length === 0) return [];
      return ctx.db.twoPoolContract.findMany({
        where: { address: { in: input.addresses } },
        select: {
          address: true,
          name: true,
          description: true,
        },
      });
    }),
  byVault: publicProcedure
    .input(z.object({ vault: z.string() }))
    .query(async ({ ctx, input }): Promise<TwoPoolContractOffchainData[]> => {
      return ctx.db.twoPoolContract.findMany({
        where: { vault: { equals: input.vault, mode: "insensitive" } },
        select: {
          address: true,
          name: true,
          description: true,
        },
      });
    }),
});
