import { router } from "../init";
import { offchainEventsRouter } from "./offchainEvents";

export const appRouter = router({
  offchainEvents: offchainEventsRouter,
});

export type AppRouter = typeof appRouter;
