"use client";

import { useState } from "react";
import type {
  CryptoBinaryOutcome,
  CryptoPrediction,
  CryptoPredictionHit,
  CryptoPredictionPriceRange,
  CryptoPredictionUpDown,
} from "@/shared/types/cryptoPrediction";
import { getCryptoDrawerInfoLines } from "@/shared/utils/cryptoPredictionFormat";
import { useCPFDepositBet } from "@/hooks/useCPFDepositBet";
import { DrawerShell } from "@/components/ui/DrawerShell";
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
  return p != null && p.predictionType !== "above_below";
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
        />
      ) : null}
    </DrawerShell>
  );
}

function CryptoPredictionDrawerBody({
  prediction,
  selectedOutcome,
}: {
  prediction: BinaryCryptoPrediction;
  selectedOutcome: CryptoBinaryOutcome;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = prediction.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getCryptoDrawerInfoLines(
    prediction,
    selectedOutcome.label,
  );

  const inFavor = selectedOutcome.id === prediction.outcomes[0].id;
  const { placeBet, isPending, errorMessage, status } = useCPFDepositBet(
    prediction.cpfAddress,
    prediction.cpfPoolId,
    amount,
    inFavor,
  );

  const buttonLabel =
    status === "approving"
      ? "Approving…"
      : status === "depositing"
        ? "Placing bet…"
        : status === "success"
          ? "Placed!"
          : undefined;

  const disabled = !isAvailable || isPending;

  return (
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
        errorMessage={errorMessage}
        buttonLabel={buttonLabel}
        onSubmit={() => void placeBet()}
      />
    </PredictionsDrawerTemplate>
  );
}
