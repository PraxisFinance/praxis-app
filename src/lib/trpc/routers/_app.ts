import { router } from "../init";
import { offchainEventsRouter } from "./offchainEvents";
import { twoPoolContractsRouter } from "./twoPoolContracts";
import { userHistoryRouter } from "./userHistory";

export const appRouter = router({
  offchainEvents: offchainEventsRouter,
  twoPoolContracts: twoPoolContractsRouter,
  userHistory: userHistoryRouter,
});

export type AppRouter = typeof appRouter;
