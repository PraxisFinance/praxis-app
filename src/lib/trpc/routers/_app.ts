import { router } from "../init";
import { offchainEventsRouter } from "./offchainEvents";
import { twoPoolContractsRouter } from "./twoPoolContracts";

export const appRouter = router({
  offchainEvents: offchainEventsRouter,
  twoPoolContracts: twoPoolContractsRouter,
});

export type AppRouter = typeof appRouter;
