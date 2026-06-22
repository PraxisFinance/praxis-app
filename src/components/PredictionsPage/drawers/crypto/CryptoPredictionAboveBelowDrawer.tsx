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
  const resolved = Boolean(prediction && parsed && strike);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {prediction && parsed && strike ? (
        <CryptoPredictionAboveBelowDrawerBody
          key={`${prediction.id}-${selectedOutcomeId}`}
          prediction={prediction}
          strike={strike}
          side={parsed.side}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </DrawerShell>
  );
}

function CryptoPredictionAboveBelowDrawerBody({
  prediction,
  strike,
  side,
  onClose,
}: {
  prediction: CryptoPredictionAboveBelow;
  strike: NonNullable<CryptoPredictionAboveBelow["strikes"][number]>;
  side: "yes" | "no";
  onClose: () => void;
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
    onClose();
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

      <PredictionsDrawerTemplate
        header={
          <PredictionsDrawerHeader
            trailing={<CryptoPredictionDrawerIcon iconUrl={prediction.iconUrl} />}
          />
        }
      >
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
        />
      </PredictionsDrawerTemplate>
    </>
  );
}
