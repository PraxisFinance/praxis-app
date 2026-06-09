"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import { CryptoPredictionAboveBelowDrawer } from "./CryptoPredictionAboveBelowDrawer";
import { CryptoPredictionDrawer } from "./CryptoPredictionDrawer";
import { useCryptoPredictionDrawer } from "./useCryptoPredictionDrawer";

type OpenCryptoPredictionDrawer = (prediction: CryptoPrediction, outcomeId: string) => void;

const PredictionsHubCryptoDrawerContext = createContext<OpenCryptoPredictionDrawer | null>(null);

export function usePredictionsHubCryptoDrawer(): OpenCryptoPredictionDrawer {
  return useContext(PredictionsHubCryptoDrawerContext) ?? (() => {});
}

interface PredictionsHubCryptoDrawerProviderProps {
  children: ReactNode;
}

export function PredictionsHubCryptoDrawerProvider({
  children,
}: PredictionsHubCryptoDrawerProviderProps) {
  const { open, prediction, selectedOutcomeId, openDrawer, onOpenChange } =
    useCryptoPredictionDrawer();

  const value = useMemo(() => openDrawer, [openDrawer]);
  const isAboveBelow = prediction?.predictionType === "above_below";

  return (
    <PredictionsHubCryptoDrawerContext.Provider value={value}>
      {children}
      {isAboveBelow ? (
        <CryptoPredictionAboveBelowDrawer
          prediction={prediction?.predictionType === "above_below" ? prediction : null}
          selectedOutcomeId={selectedOutcomeId}
          open={open}
          onOpenChange={onOpenChange}
        />
      ) : (
        <CryptoPredictionDrawer
          prediction={prediction}
          selectedOutcomeId={selectedOutcomeId}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    </PredictionsHubCryptoDrawerContext.Provider>
  );
}
