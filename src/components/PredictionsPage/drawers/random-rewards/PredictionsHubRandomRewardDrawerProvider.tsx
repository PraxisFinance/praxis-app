"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { RandomPoolEnded, RandomPoolLive } from "@/shared/types/randomPool";
import { RandomRewardClaimDrawer } from "./RandomRewardClaimDrawer";
import { RandomRewardJoinDrawer } from "./RandomRewardJoinDrawer";
import { useRandomRewardDrawer } from "./useRandomRewardDrawer";

type RandomRewardDrawerContextValue = {
  openJoinDrawer: (pool: RandomPoolLive) => void;
  openClaimDrawer: (pool: RandomPoolEnded) => void;
};

const PredictionsHubRandomRewardDrawerContext =
  createContext<RandomRewardDrawerContextValue | null>(null);

export function usePredictionsHubRandomRewardJoinDrawer(): (pool: RandomPoolLive) => void {
  const context = useContext(PredictionsHubRandomRewardDrawerContext);
  return context?.openJoinDrawer ?? (() => {});
}

export function usePredictionsHubRandomRewardClaimDrawer(): (pool: RandomPoolEnded) => void {
  const context = useContext(PredictionsHubRandomRewardDrawerContext);
  return context?.openClaimDrawer ?? (() => {});
}

interface PredictionsHubRandomRewardDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubRandomRewardDrawerProvider({
  children,
}: PredictionsHubRandomRewardDrawerProviderProps) {
  const {
    joinOpen,
    joinPool,
    claimOpen,
    claimPool,
    openJoinDrawer,
    openClaimDrawer,
    onJoinOpenChange,
    onClaimOpenChange,
  } = useRandomRewardDrawer();

  const value = useMemo(
    () => ({ openJoinDrawer, openClaimDrawer }),
    [openJoinDrawer, openClaimDrawer],
  );

  return (
    <PredictionsHubRandomRewardDrawerContext.Provider value={value}>
      {children}
      <RandomRewardJoinDrawer pool={joinPool} open={joinOpen} onOpenChange={onJoinOpenChange} />
      <RandomRewardClaimDrawer pool={claimPool} open={claimOpen} onOpenChange={onClaimOpenChange} />
    </PredictionsHubRandomRewardDrawerContext.Provider>
  );
}
