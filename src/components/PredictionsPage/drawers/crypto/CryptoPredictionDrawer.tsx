"use client";

import { useState } from "react";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
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
  CryptoPredictionDrawerForm,
  CryptoPredictionDrawerHeading,
  CryptoPredictionDrawerOutcomeCard,
  formatCryptoPredictionDrawerPrice,
} from "./shared";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === YT_ICON_URL)?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

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
          : "Place prediction";

  const disabled = !isAvailable || isPending;

  return (
    <div className="flex flex-col gap-4">
      <CryptoPredictionDrawerHeading iconUrl={prediction.iconUrl} />

      <CryptoPredictionDrawerOutcomeCard
        primaryLine={primaryQuestion}
        secondaryLine={secondaryMuted}
        poolPercent={selectedOutcome.poolPercent}
      />

      <CryptoPredictionDrawerForm
        amount={amount}
        onAmountChange={setAmount}
        maxBalance={PREDICTION_MAX_BALANCE}
        priceLabel={formatCryptoPredictionDrawerPrice(selectedOutcome.odds)}
        disabled={disabled}
        unavailableMessage={!isAvailable ? "Predictions are unavailable for this market." : null}
        errorMessage={errorMessage}
        buttonLabel={buttonLabel}
        onSubmit={() => void placeBet()}
      />
    </div>
  );
}
