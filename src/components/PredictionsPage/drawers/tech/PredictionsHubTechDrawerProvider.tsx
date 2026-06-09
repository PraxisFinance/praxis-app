"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TechHubEvent } from "@/shared/types/techHubEvent";
import { TechEventHubDrawer } from "./TechEventHubDrawer";
import { useTechEventDrawer } from "./useTechEventDrawer";

type OpenTechEventDrawer = (event: TechHubEvent, outcomeId: string) => void;

const PredictionsHubTechDrawerContext = createContext<OpenTechEventDrawer | null>(null);

export function usePredictionsHubTechDrawer(): OpenTechEventDrawer {
  return useContext(PredictionsHubTechDrawerContext) ?? (() => {});
}

interface PredictionsHubTechDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubTechDrawerProvider({ children }: PredictionsHubTechDrawerProviderProps) {
  const { open, event, selectedOutcomeId, openDrawer, onOpenChange } = useTechEventDrawer();
  const value = useMemo(() => openDrawer, [openDrawer]);

  return (
    <PredictionsHubTechDrawerContext.Provider value={value}>
      {children}
      <TechEventHubDrawer
        event={event}
        selectedOutcomeId={selectedOutcomeId}
        open={open}
        onOpenChange={onOpenChange}
      />
    </PredictionsHubTechDrawerContext.Provider>
  );
}
