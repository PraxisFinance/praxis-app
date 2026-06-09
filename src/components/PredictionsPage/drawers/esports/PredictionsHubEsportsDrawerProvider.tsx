"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { EsportsMatchHubDrawer } from "./EsportsMatchHubDrawer";
import { useEsportsMatchDrawer, type EsportsMatchDrawerSide } from "./useEsportsMatchDrawer";

type OpenEsportsMatchDrawer = (match: EsportsMatch, side: EsportsMatchDrawerSide) => void;

const PredictionsHubEsportsDrawerContext = createContext<OpenEsportsMatchDrawer | null>(null);

export function usePredictionsHubEsportsDrawer(): OpenEsportsMatchDrawer {
  return useContext(PredictionsHubEsportsDrawerContext) ?? (() => {});
}

interface PredictionsHubEsportsDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubEsportsDrawerProvider({
  children,
}: PredictionsHubEsportsDrawerProviderProps) {
  const { open, match, side, openDrawer, onOpenChange } = useEsportsMatchDrawer();
  const value = useMemo(() => openDrawer, [openDrawer]);

  return (
    <PredictionsHubEsportsDrawerContext.Provider value={value}>
      {children}
      <EsportsMatchHubDrawer match={match} side={side} open={open} onOpenChange={onOpenChange} />
    </PredictionsHubEsportsDrawerContext.Provider>
  );
}
