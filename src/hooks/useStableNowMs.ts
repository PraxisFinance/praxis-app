"use client";

import { useSyncExternalStore } from "react";

const NOW_BUCKET_MS = 60_000;

/**
 * Stable clock for time filters — server snapshot is fixed to avoid hydration mismatch.
 * Client updates once per minute.
 */
export function useStableNowMs(serverAnchorMs = 0): number {
  const serverBucket = Math.floor(serverAnchorMs / NOW_BUCKET_MS);

  const bucket = useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setInterval(onStoreChange, NOW_BUCKET_MS);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / NOW_BUCKET_MS),
    () => serverBucket,
  );

  return bucket * NOW_BUCKET_MS;
}
