"use client";

import { useCallback, useState } from "react";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";

export function useCryptoPredictionDrawer() {
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState<CryptoPrediction | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);

  const openDrawer = useCallback((nextPrediction: CryptoPrediction, outcomeId: string) => {
    setPrediction(nextPrediction);
    setSelectedOutcomeId(outcomeId);
    setOpen(true);
  }, []);

  const onOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPrediction(null);
      setSelectedOutcomeId(null);
    }
  }, []);

  return {
    open,
    prediction,
    selectedOutcomeId,
    openDrawer,
    onOpenChange,
  };
}
