"use client";

import { useState } from "react";
import type { FinanceHubBinaryOutcome, FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { getFinanceDrawerInfoLines } from "@/shared/utils/financeHubEventFormat";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
  PredictionsDrawerHeaderImage,
  PredictionsDrawerPlaceButton,
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

  if (!event || !selectedOutcome) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <FinanceEventHubDrawerBody
      key={`${event.id}-${selectedOutcome.id}`}
      event={event}
      selectedOutcome={selectedOutcome}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function FinanceEventHubDrawerBody({
  event,
  selectedOutcome,
  open,
  onOpenChange,
}: {
  event: FinanceHubEvent;
  selectedOutcome: FinanceHubBinaryOutcome;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getFinanceDrawerInfoLines(
    event,
    selectedOutcome.label,
  );

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      header={
        <PredictionsDrawerHeader
          trailing={
            <PredictionsDrawerHeaderImage imageUrl={event.imageUrl} imageFit="contain" />
          }
        />
      }
      footer={
        <PredictionsDrawerPlaceButton disabled={!isAvailable} onClick={() => {}} />
      }
    >
      <PredictionsDrawerTemplate>
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
          hideAction
        />
      </PredictionsDrawerTemplate>
    </DrawerShell>
  );
}
