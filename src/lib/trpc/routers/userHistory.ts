import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getAddress } from "viem";
import { publicProcedure, router } from "../init";
import { getUserHistory } from "@/lib/history/userHistoryService";

export const userHistoryRouter = router({
  get: publicProcedure
    .input(
      z.object({
        address: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid Ethereum address"),
      })
    )
    .query(async ({ input }) => {
      if (process.env.NEXT_PUBLIC_HISTORY_V1 !== "on") {
        throw new TRPCError({ code: "NOT_FOUND", message: "History feature not enabled" });
      }
      const history = await getUserHistory(getAddress(input.address));
      console.log("history", history.portfolio.positions.cpfBets);

      return history;
    }),
});
