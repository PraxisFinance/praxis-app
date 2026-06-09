"use client";

import type { ReactNode } from "react";
import {
  PredictionsHubCryptoDrawerProvider,
  PredictionsHubEsportsDrawerProvider,
  PredictionsHubRandomRewardDrawerProvider,
  PredictionsHubPoliticsDrawerProvider,
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
          <PredictionsHubSportDrawerProvider>
            <PredictionsHubPoliticsDrawerProvider>{children}</PredictionsHubPoliticsDrawerProvider>
          </PredictionsHubSportDrawerProvider>
        </PredictionsHubRandomRewardDrawerProvider>
      </PredictionsHubEsportsDrawerProvider>
    </PredictionsHubCryptoDrawerProvider>
  );
}
