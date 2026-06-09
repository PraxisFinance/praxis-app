"use client";

import type { ReactNode } from "react";
import {
  PredictionsHubCryptoDrawerProvider,
  PredictionsHubEsportsDrawerProvider,
} from "@/components/PredictionsPage/drawers";

interface PredictionsHubLayoutShellProps {
  children: ReactNode;
}

export function PredictionsHubLayoutShell({ children }: PredictionsHubLayoutShellProps) {
  return (
    <PredictionsHubCryptoDrawerProvider>
      <PredictionsHubEsportsDrawerProvider>{children}</PredictionsHubEsportsDrawerProvider>
    </PredictionsHubCryptoDrawerProvider>
  );
}
