"use client";

import { useState } from "react";
import type { FinanceHubBinaryOutcome, FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { getFinanceDrawerInfoLines } from "@/shared/utils/financeHubEventFormat";
import { useCPF } from "@/hooks/useCPF";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";
import {
  usePredictionsDrawerMaxBalance,
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
  const { maxBalance, ytBalance } = usePredictionsDrawerMaxBalance();
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getFinanceDrawerInfoLines(
    event,
    selectedOutcome.label,
  );

  const inFavor = selectedOutcome.id === event.outcomes[0].id;
  const { placeBet, isBetPending, betError, betStatus, resetBet, insufficientBalance } = useCPF(
    event.cpfAddress,
    event.cpfPoolId,
    amount,
    inFavor,
    ytBalance,
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
  const canSubmit = !disabled && !insufficientBalance && amount !== "";

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
            trailing={
              <PredictionsDrawerHeaderImage imageUrl={event.imageUrl} imageFit="contain" />
            }
          />
        }
        footer={
          <PredictionsDrawerPlaceButton
            disabled={!canSubmit}
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
            maxBalance={maxBalance}
            priceLabel={formatCryptoPredictionDrawerPrice(selectedOutcome.odds)}
            disabled={disabled}
            unavailableMessage={!isAvailable ? "Predictions are unavailable for this market." : null}
            errorMessage={betError ?? (insufficientBalance ? "Insufficient YT balance." : null)}
            buttonLabel={buttonLabel}
            onSubmit={() => void placeBet()}
            hideAction
          />
        </PredictionsDrawerTemplate>
      </DrawerShell>
    </>
  );
}
