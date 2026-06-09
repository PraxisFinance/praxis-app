"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { FinanceEventHubDrawer } from "./FinanceEventHubDrawer";
import { useFinanceEventDrawer } from "./useFinanceEventDrawer";

type OpenFinanceEventDrawer = (event: FinanceHubEvent, outcomeId: string) => void;

const PredictionsHubFinanceDrawerContext = createContext<OpenFinanceEventDrawer | null>(null);

export function usePredictionsHubFinanceDrawer(): OpenFinanceEventDrawer {
  return useContext(PredictionsHubFinanceDrawerContext) ?? (() => {});
}

interface PredictionsHubFinanceDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubFinanceDrawerProvider({
  children,
}: PredictionsHubFinanceDrawerProviderProps) {
  const { open, event, selectedOutcomeId, openDrawer, onOpenChange } = useFinanceEventDrawer();
  const value = useMemo(() => openDrawer, [openDrawer]);

  return (
    <PredictionsHubFinanceDrawerContext.Provider value={value}>
      {children}
      <FinanceEventHubDrawer
        event={event}
        selectedOutcomeId={selectedOutcomeId}
        open={open}
        onOpenChange={onOpenChange}
      />
    </PredictionsHubFinanceDrawerContext.Provider>
  );
}
