import { router } from "../init";
import { offchainEventsRouter } from "./offchainEvents";
import { rydContractsRouter } from "./rydContracts";
import { twoPoolContractsRouter } from "./twoPoolContracts";
import { userHistoryRouter } from "./userHistory";

export const appRouter = router({
  offchainEvents: offchainEventsRouter,
  rydContracts: rydContractsRouter,
  twoPoolContracts: twoPoolContractsRouter,
  userHistory: userHistoryRouter,
});

export type AppRouter = typeof appRouter;
