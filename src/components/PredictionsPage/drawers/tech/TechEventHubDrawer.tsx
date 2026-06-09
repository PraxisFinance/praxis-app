"use client";

import { useState } from "react";
import type { TechHubBinaryOutcome, TechHubEvent } from "@/shared/types/techHubEvent";
import { getTechDrawerInfoLines } from "@/shared/utils/techHubEventFormat";
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
  const resolved = Boolean(event && selectedOutcome);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {event && selectedOutcome ? (
        <TechEventHubDrawerBody
          key={`${event.id}-${selectedOutcome.id}`}
          event={event}
          selectedOutcome={selectedOutcome}
        />
      ) : null}
    </DrawerShell>
  );
}

function TechEventHubDrawerBody({
  event,
  selectedOutcome,
}: {
  event: TechHubEvent;
  selectedOutcome: TechHubBinaryOutcome;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getTechDrawerInfoLines(event, selectedOutcome.label);

  return (
    <PredictionsDrawerTemplate
      header={
        <PredictionsDrawerHeader
          trailing={<PredictionsDrawerHeaderImage imageUrl={event.thumbnailUrl} />}
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
