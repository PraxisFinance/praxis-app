"use client";

import type { ReactNode } from "react";
import {
  PredictionsHubCryptoDrawerProvider,
  PredictionsHubEsportsDrawerProvider,
  PredictionsHubRandomRewardDrawerProvider,
  PredictionsHubSportDrawerProvider,
} from "@/components/PredictionsPage/drawers";

interface PredictionsHubLayoutShellProps {
  children: ReactNode;
}

export function PredictionsHubLayoutShell({ children }: PredictionsHubLayoutShellProps) {
  return (
    <PredictionsHubCryptoDrawerProvider>
      <PredictionsHubEsportsDrawerProvider>
        <PredictionsHubRandomRewardDrawerProvider>
          <PredictionsHubSportDrawerProvider>{children}</PredictionsHubSportDrawerProvider>
        </PredictionsHubRandomRewardDrawerProvider>
      </PredictionsHubEsportsDrawerProvider>
    </PredictionsHubCryptoDrawerProvider>
  );
}
