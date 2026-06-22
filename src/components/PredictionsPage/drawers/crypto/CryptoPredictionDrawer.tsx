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
  const resolved = Boolean(binary && selectedOutcome);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {binary && selectedOutcome ? (
        <CryptoPredictionDrawerBody
          key={`${binary.id}-${selectedOutcome.id}`}
          prediction={binary}
          selectedOutcome={selectedOutcome}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </DrawerShell>
  );
}

function CryptoPredictionDrawerBody({
  prediction,
  selectedOutcome,
  onClose,
}: {
  prediction: BinaryCryptoPrediction;
  selectedOutcome: PredictionOutcome;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = prediction.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getCryptoDrawerInfoLines(
    prediction,
    selectedOutcome.label
  );

  const inFavor = selectedOutcome.id === prediction.outcomes[0].id;
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
        />
      </PredictionsDrawerTemplate>
    </>
  );
}
