"use client";

import { useState } from "react";
import type { TechHubBinaryOutcome, TechHubEvent } from "@/shared/types/techHubEvent";
import { getTechDrawerInfoLines } from "@/shared/utils/techHubEventFormat";
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

export interface TechEventHubDrawerProps {
  event: TechHubEvent | null;
  selectedOutcomeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechEventHubDrawer({
  event,
  selectedOutcomeId,
  open,
  onOpenChange,
}: TechEventHubDrawerProps) {
  const selectedOutcome =
    event && selectedOutcomeId
      ? (event.outcomes.find((outcome) => outcome.id === selectedOutcomeId) ?? null)
      : null;

  if (!event || !selectedOutcome) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <TechEventHubDrawerBody
      key={`${event.id}-${selectedOutcome.id}`}
      event={event}
      selectedOutcome={selectedOutcome}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function TechEventHubDrawerBody({
  event,
  selectedOutcome,
  open,
  onOpenChange,
}: {
  event: TechHubEvent;
  selectedOutcome: TechHubBinaryOutcome;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getTechDrawerInfoLines(event, selectedOutcome.label);

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      header={
        <PredictionsDrawerHeader
          trailing={<PredictionsDrawerHeaderImage imageUrl={event.imageUrl} />}
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
