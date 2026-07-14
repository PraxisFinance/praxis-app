"use client";

import type { ReactNode } from "react";
import {
  PredictionsHubCryptoDrawerProvider,
  PredictionsHubEsportsDrawerProvider,
  PredictionsHubFinanceDrawerProvider,
  PredictionsHubRandomRewardDrawerProvider,
  PredictionsHubPoliticsDrawerProvider,
  PredictionsHubSportDrawerProvider,
  PredictionsHubTechDrawerProvider,
  PredictionsHubTwoPoolDrawerProvider,
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
            <PredictionsHubPoliticsDrawerProvider>
              <PredictionsHubFinanceDrawerProvider>
                <PredictionsHubTechDrawerProvider>
                  <PredictionsHubTwoPoolDrawerProvider>
                    {children}
                  </PredictionsHubTwoPoolDrawerProvider>
                </PredictionsHubTechDrawerProvider>
              </PredictionsHubFinanceDrawerProvider>
            </PredictionsHubPoliticsDrawerProvider>
          </PredictionsHubSportDrawerProvider>
        </PredictionsHubRandomRewardDrawerProvider>
      </PredictionsHubEsportsDrawerProvider>
    </PredictionsHubCryptoDrawerProvider>
  );
}
