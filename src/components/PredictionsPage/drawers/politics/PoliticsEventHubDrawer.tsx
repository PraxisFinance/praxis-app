"use client";

import { useState } from "react";
import type { PoliticsHubBinaryOutcome, PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import { getPoliticsDrawerInfoLines } from "@/shared/utils/politicsHubEventFormat";
import { useCPF } from "@/hooks/useCPF";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";
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

  const inFavor = selectedOutcome.id === event.outcomes[0].id;
  const { placeBet, isBetPending, betError, betStatus, resetBet } = useCPF(
    event.cpfAddress,
    event.cpfPoolId,
    amount,
    inFavor,
  );

  const buttonLabel =
    betStatus === "approving"
      ? "Approving…"
      : betStatus === "depositing"
        ? "Placing bet…"
        : betStatus === "success"
          ? "Placed!"
          : undefined;

  const disabled = !isAvailable || isBetPending;

  function handleSuccessClose() {
    resetBet();
    onOpenChange(false);
  }

  return (
    <>
      <RequestResultDialog
        open={betStatus === "error"}
        onClose={resetBet}
        title="Bet Failed"
        description={betError ?? "Something went wrong. Please try again."}
      />

      <RequestResultDialog
        open={betStatus === "success"}
        onClose={handleSuccessClose}
        status="success"
        title="Bet Placed"
        description="Your prediction has been placed successfully."
        closeLabel="Done"
      />

      <DrawerShell
        open={open}
        onOpenChange={onOpenChange}
        header={
          <PredictionsDrawerHeader
            trailing={<PredictionsDrawerHeaderImage imageUrl={event.imageUrl} />}
          />
        }
        footer={
          <PredictionsDrawerPlaceButton
            disabled={disabled}
            onClick={() => void placeBet()}
            label={buttonLabel}
          />
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
            disabled={disabled}
            unavailableMessage={!isAvailable ? "Predictions are unavailable for this market." : null}
            errorMessage={betError}
            buttonLabel={buttonLabel}
            onSubmit={() => void placeBet()}
            hideAction
          />
        </PredictionsDrawerTemplate>
      </DrawerShell>
    </>
  );
}
