"use client";

import { useState } from "react";
import type {
  CryptoPrediction,
  CryptoPredictionHit,
  CryptoPredictionPriceRange,
  CryptoPredictionUpDown,
} from "@/shared/types/cryptoPrediction";
import type { PredictionOutcome } from "@/shared/types/predictions";
import { getCryptoDrawerInfoLines } from "@/shared/utils/cryptoPredictionFormat";
import { useCPF } from "@/hooks/useCPF";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";
import {
  usePredictionsDrawerMaxBalance,
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

export type BinaryCryptoPrediction =
  | CryptoPredictionUpDown
  | CryptoPredictionPriceRange
  | CryptoPredictionHit;

function isBinaryCryptoPrediction(p: CryptoPrediction | null): p is BinaryCryptoPrediction {
  return p != null && p.predictionType !== "crypto_above_below";
}

export interface CryptoPredictionDrawerProps {
  prediction: CryptoPrediction | null;
  selectedOutcomeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CryptoPredictionDrawer({
  prediction,
  selectedOutcomeId,
  open,
  onOpenChange,
}: CryptoPredictionDrawerProps) {
  const binary = isBinaryCryptoPrediction(prediction) ? prediction : null;
  const selectedOutcome =
    binary && selectedOutcomeId
      ? (binary.outcomes.find((o) => o.id === selectedOutcomeId) ?? null)
      : null;

  if (!binary || !selectedOutcome) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <CryptoPredictionDrawerBody
      key={`${binary.id}-${selectedOutcome.id}`}
      prediction={binary}
      selectedOutcome={selectedOutcome}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function CryptoPredictionDrawerBody({
  prediction,
  selectedOutcome,
  open,
  onOpenChange,
}: {
  prediction: BinaryCryptoPrediction;
  selectedOutcome: PredictionOutcome;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const { maxBalance, ytBalance } = usePredictionsDrawerMaxBalance();
  const isAvailable = prediction.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getCryptoDrawerInfoLines(
    prediction,
    selectedOutcome.label
  );

  const inFavor = selectedOutcome.id === prediction.outcomes[0].id;
  const { placeBet, isBetPending, betError, betStatus, resetBet, insufficientBalance } = useCPF(
    prediction.cpfAddress,
    prediction.cpfPoolId,
    amount,
    inFavor,
    ytBalance
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
            trailing={<CryptoPredictionDrawerIcon iconUrl={prediction.iconUrl} />}
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
