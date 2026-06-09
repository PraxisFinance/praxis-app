"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import { SportMatchHubDrawer } from "./SportMatchHubDrawer";
import { useSportMatchDrawer, type SportMatchDrawerSide } from "./useSportMatchDrawer";

type OpenSportMatchDrawer = (match: SportHubMatch, side: SportMatchDrawerSide) => void;

const PredictionsHubSportDrawerContext = createContext<OpenSportMatchDrawer | null>(null);

export function usePredictionsHubSportDrawer(): OpenSportMatchDrawer {
  return useContext(PredictionsHubSportDrawerContext) ?? (() => {});
}

interface PredictionsHubSportDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubSportDrawerProvider({
  children,
}: PredictionsHubSportDrawerProviderProps) {
  const { open, match, side, openDrawer, onOpenChange } = useSportMatchDrawer();
  const value = useMemo(() => openDrawer, [openDrawer]);

  return (
    <PredictionsHubSportDrawerContext.Provider value={value}>
      {children}
      <SportMatchHubDrawer match={match} side={side} open={open} onOpenChange={onOpenChange} />
    </PredictionsHubSportDrawerContext.Provider>
  );
}
