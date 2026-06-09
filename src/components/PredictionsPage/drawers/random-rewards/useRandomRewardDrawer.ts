"use client";

import { useCallback, useState } from "react";
import type { RandomPoolEnded, RandomPoolLive } from "@/shared/types/randomPool";

export function useRandomRewardDrawer() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinPool, setJoinPool] = useState<RandomPoolLive | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimPool, setClaimPool] = useState<RandomPoolEnded | null>(null);

  const openJoinDrawer = useCallback((pool: RandomPoolLive) => {
    setJoinPool(pool);
    setJoinOpen(true);
  }, []);

  const openClaimDrawer = useCallback((pool: RandomPoolEnded) => {
    setClaimPool(pool);
    setClaimOpen(true);
  }, []);

  const onJoinOpenChange = useCallback((nextOpen: boolean) => {
    setJoinOpen(nextOpen);
    if (!nextOpen) {
      setJoinPool(null);
    }
  }, []);

  const onClaimOpenChange = useCallback((nextOpen: boolean) => {
    setClaimOpen(nextOpen);
    if (!nextOpen) {
      setClaimPool(null);
    }
  }, []);

  return {
    joinOpen,
    joinPool,
    claimOpen,
    claimPool,
    openJoinDrawer,
    openClaimDrawer,
    onJoinOpenChange,
    onClaimOpenChange,
  };
}
