"use client";

import { useState } from "react";
import type { PoliticsHubBinaryOutcome, PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import { getPoliticsDrawerInfoLines } from "@/shared/utils/politicsHubEventFormat";
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

export interface PoliticsEventHubDrawerProps {
  event: PoliticsHubEvent | null;
  selectedOutcomeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PoliticsEventHubDrawer({
  event,
  selectedOutcomeId,
  open,
  onOpenChange,
}: PoliticsEventHubDrawerProps) {
  const selectedOutcome =
    event && selectedOutcomeId
      ? (event.outcomes.find((outcome) => outcome.id === selectedOutcomeId) ?? null)
      : null;

  if (!event || !selectedOutcome) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <PoliticsEventHubDrawerBody
      key={`${event.id}-${selectedOutcome.id}`}
      event={event}
      selectedOutcome={selectedOutcome}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function PoliticsEventHubDrawerBody({
  event,
  selectedOutcome,
  open,
  onOpenChange,
}: {
  event: PoliticsHubEvent;
  selectedOutcome: PoliticsHubBinaryOutcome;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getPoliticsDrawerInfoLines(
    event,
    selectedOutcome.label,
  );

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
