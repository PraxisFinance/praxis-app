"use client";

import { useState } from "react";
import type { FinanceHubBinaryOutcome, FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { getFinanceDrawerInfoLines } from "@/shared/utils/financeHubEventFormat";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
  PredictionsDrawerHeaderImage,
  PredictionsDrawerPredictionForm,
  PredictionsDrawerTemplate,
} from "../shared";
import {
  CryptoPredictionDrawerOutcomeCard,
  formatCryptoPredictionDrawerPrice,
} from "../crypto/shared";

export interface FinanceEventHubDrawerProps {
  event: FinanceHubEvent | null;
  selectedOutcomeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinanceEventHubDrawer({
  event,
  selectedOutcomeId,
  open,
  onOpenChange,
}: FinanceEventHubDrawerProps) {
  const selectedOutcome =
    event && selectedOutcomeId
      ? (event.outcomes.find((outcome) => outcome.id === selectedOutcomeId) ?? null)
      : null;
  const resolved = Boolean(event && selectedOutcome);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {event && selectedOutcome ? (
        <FinanceEventHubDrawerBody
          key={`${event.id}-${selectedOutcome.id}`}
          event={event}
          selectedOutcome={selectedOutcome}
        />
      ) : null}
    </DrawerShell>
  );
}

function FinanceEventHubDrawerBody({
  event,
  selectedOutcome,
}: {
  event: FinanceHubEvent;
  selectedOutcome: FinanceHubBinaryOutcome;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getFinanceDrawerInfoLines(
    event,
    selectedOutcome.label,
  );

  return (
    <PredictionsDrawerTemplate
      header={
        <PredictionsDrawerHeader
          trailing={
            <PredictionsDrawerHeaderImage imageUrl={event.imageUrl} imageFit="contain" />
          }
        />
      }
    >
      <CryptoPredictionDrawerOutcomeCard
        primaryLine={primaryQuestion}
        secondaryLine={secondaryMuted}
        poolPercent={selectedOutcome.poolPercent}
      />

      <PredictionsDrawerPredictionForm
        amount={amount}
        onAmountChange={setAmount}
        maxBalance={PREDICTIONS_DRAWER_MAX_BALANCE}
        priceLabel={formatCryptoPredictionDrawerPrice(selectedOutcome.odds)}
        disabled={!isAvailable}
        unavailableMessage={!isAvailable ? "Predictions are unavailable for this market." : null}
        onSubmit={() => {}}
      />
    </PredictionsDrawerTemplate>
  );
}
