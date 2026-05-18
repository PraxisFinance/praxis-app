"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import type {
  CryptoBinaryOutcome,
  CryptoPrediction,
  CryptoPredictionHit,
  CryptoPredictionPriceRange,
  CryptoPredictionUpDown,
} from "@/shared/types/cryptoPrediction";
import { getCryptoDrawerInfoLines } from "@/shared/utils/cryptoPredictionFormat";
import { useCPFDepositBet } from "@/hooks/useCPFDepositBet";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === "/icons/yt-token.png")?.value ??
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
    selectedOutcome.label
  );
  const iconUrl = prediction.iconUrl.trim();

  const inFavor = selectedOutcome.id === prediction.outcomes[0].id;
  const { placeBet, isPending, errorMessage, status } = useCPFDepositBet(
    prediction.cpfAddress,
    prediction.cpfPoolId,
    amount,
    inFavor
  );

  const buttonLabel =
    status === "approving"
      ? "Approving…"
      : status === "depositing"
        ? "Placing bet…"
        : status === "success"
          ? "Placed!"
          : "Place prediction";

  return (
    <div className="flex flex-col gap-3">
      <AppDrawerHeading title="Make a prediction" />

      <div className="flex flex-col gap-3 rounded-sm bg-main-grayPurple/80 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-sm leading-tight text-main-darkPurple">{primaryQuestion}</p>
          <span className="shrink-0 text-sm tabular-nums text-main-darkPurple">
            {selectedOutcome.poolPercent}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 text-xs leading-tight font-medium text-main-darkPurple/65">
            {secondaryMuted}
          </p>
          <div className="relative h-6 w-6 shrink-0">
            {iconUrl ? (
              <Image src={iconUrl} alt="" width={24} height={24} className="object-contain" />
            ) : (
              <span className="block h-6 w-6 rounded-sm bg-main-grayPurple" aria-hidden />
            )}
          </div>
        </div>
      </div>

      {!isAvailable && (
        <p className="text-center text-sm leading-5 text-main-darkPurple/80">
          Predictions are unavailable for this market.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <InputWithMax
          value={amount}
          onChange={setAmount}
          maxValue={PREDICTION_MAX_BALANCE}
          placeholder="Prediction amount"
          disabled={!isAvailable || isPending}
        />
      </div>

      {errorMessage && (
        <p className="text-center text-xs leading-snug text-main-red" role="alert">
          {errorMessage}
        </p>
      )}

      <Button
        variant="primary"
        size="action"
        disabled={!isAvailable || isPending}
        onClick={() => void placeBet()}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
