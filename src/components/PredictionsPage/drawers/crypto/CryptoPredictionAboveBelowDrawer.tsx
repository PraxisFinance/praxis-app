"use client";

import { useState } from "react";
import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import { getCryptoAboveBelowDrawerInfoLines } from "@/shared/utils/cryptoPredictionFormat";
import { useCPF } from "@/hooks/useCPF";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
  PredictionsDrawerPlaceButton,
  PredictionsDrawerPredictionForm,
  PredictionsDrawerTemplate,
} from "../shared";
import {
  CryptoPredictionDrawerIcon,
  CryptoPredictionDrawerOutcomeCard,
  formatCryptoPredictionDrawerPrice,
} from "./shared";
import { parseCryptoAboveBelowOutcomeId } from "./parseCryptoAboveBelowOutcomeId";

export interface CryptoPredictionAboveBelowDrawerProps {
  prediction: CryptoPredictionAboveBelow | null;
  selectedOutcomeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CryptoPredictionAboveBelowDrawer({
  prediction,
  selectedOutcomeId,
  open,
  onOpenChange,
}: CryptoPredictionAboveBelowDrawerProps) {
  const parsed =
    prediction && selectedOutcomeId ? parseCryptoAboveBelowOutcomeId(selectedOutcomeId) : null;
  const strike =
    prediction && parsed
      ? (prediction.strikes.find((row) => row.id === parsed.strikeId) ?? null)
      : null;

  if (!prediction || !parsed || !strike) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <CryptoPredictionAboveBelowDrawerBody
      key={`${prediction.id}-${selectedOutcomeId}`}
      prediction={prediction}
      strike={strike}
      side={parsed.side}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function CryptoPredictionAboveBelowDrawerBody({
  prediction,
  strike,
  side,
  open,
  onOpenChange,
}: {
  prediction: CryptoPredictionAboveBelow;
  strike: NonNullable<CryptoPredictionAboveBelow["strikes"][number]>;
  side: "yes" | "no";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = prediction.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getCryptoAboveBelowDrawerInfoLines(
    prediction,
    strike,
    side
  );
  const selectedOutcome = side === "yes" ? strike.yes : strike.no;
  const selectedPoolPercent = selectedOutcome.poolPercent;

  const inFavor = side === "yes";
  const { placeBet, isBetPending, betError, betStatus, resetBet } = useCPF(
    prediction.cpfAddress,
    prediction.cpfPoolId,
    amount,
    inFavor
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
            trailing={<CryptoPredictionDrawerIcon iconUrl={prediction.iconUrl} />}
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
            poolPercent={selectedPoolPercent}
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
