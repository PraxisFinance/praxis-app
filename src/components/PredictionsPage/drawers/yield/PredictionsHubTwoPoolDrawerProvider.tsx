"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import { TwoPoolHubDrawer } from "./TwoPoolHubDrawer";
import { useTwoPoolDrawer } from "./useTwoPoolDrawer";

type OpenTwoPoolDrawer = (pool: TwoPool, side: TwoPoolSide) => void;

const PredictionsHubTwoPoolDrawerContext = createContext<OpenTwoPoolDrawer | null>(null);

export function usePredictionsHubTwoPoolDrawer(): OpenTwoPoolDrawer {
  return useContext(PredictionsHubTwoPoolDrawerContext) ?? (() => {});
}

interface PredictionsHubTwoPoolDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubTwoPoolDrawerProvider({
  children,
}: PredictionsHubTwoPoolDrawerProviderProps) {
  const { open, pool, side, openDrawer, onOpenChange } = useTwoPoolDrawer();
  const value = useMemo(() => openDrawer, [openDrawer]);

  return (
    <PredictionsHubTwoPoolDrawerContext.Provider value={value}>
      {children}
      <TwoPoolHubDrawer pool={pool} side={side} open={open} onOpenChange={onOpenChange} />
    </PredictionsHubTwoPoolDrawerContext.Provider>
  );
}
