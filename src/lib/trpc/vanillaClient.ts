import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./routers/_app";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
