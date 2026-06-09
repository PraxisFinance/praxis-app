"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import { PoliticsEventHubDrawer } from "./PoliticsEventHubDrawer";
import { usePoliticsEventDrawer } from "./usePoliticsEventDrawer";

type OpenPoliticsEventDrawer = (event: PoliticsHubEvent, outcomeId: string) => void;

const PredictionsHubPoliticsDrawerContext = createContext<OpenPoliticsEventDrawer | null>(null);

export function usePredictionsHubPoliticsDrawer(): OpenPoliticsEventDrawer {
  return useContext(PredictionsHubPoliticsDrawerContext) ?? (() => {});
}

interface PredictionsHubPoliticsDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubPoliticsDrawerProvider({
  children,
}: PredictionsHubPoliticsDrawerProviderProps) {
  const { open, event, selectedOutcomeId, openDrawer, onOpenChange } = usePoliticsEventDrawer();
  const value = useMemo(() => openDrawer, [openDrawer]);

  return (
    <PredictionsHubPoliticsDrawerContext.Provider value={value}>
      {children}
      <PoliticsEventHubDrawer
        event={event}
        selectedOutcomeId={selectedOutcomeId}
        open={open}
        onOpenChange={onOpenChange}
      />
    </PredictionsHubPoliticsDrawerContext.Provider>
  );
}
