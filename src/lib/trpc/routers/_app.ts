import { router } from "../init";
import { offchainEventsRouter } from "./offchainEvents";
import { rydContractsRouter } from "./rydContracts";
import { twoPoolContractsRouter } from "./twoPoolContracts";

export const appRouter = router({
  offchainEvents: offchainEventsRouter,
  rydContracts: rydContractsRouter,
  twoPoolContracts: twoPoolContractsRouter,
});

export type AppRouter = typeof appRouter;
