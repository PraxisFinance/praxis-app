"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { YT_ICON_URL, isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import type { CryptoPredictionAboveBelow } from "@/shared/types/cryptoPrediction";
import { getCryptoAboveBelowDrawerInfoLines } from "@/shared/utils/cryptoPredictionFormat";
import { useCPFDepositBet } from "@/hooks/useCPFDepositBet";
import { parseCryptoAboveBelowOutcomeId } from "./parseCryptoAboveBelowOutcomeId";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === YT_ICON_URL)?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

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
    prediction && selectedOutcomeId
      ? parseCryptoAboveBelowOutcomeId(selectedOutcomeId)
      : null;
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
        />
      ) : null}
    </DrawerShell>
  );
}

function CryptoPredictionAboveBelowDrawerBody({
  prediction,
  strike,
  side,
}: {
  prediction: CryptoPredictionAboveBelow;
  strike: NonNullable<CryptoPredictionAboveBelow["strikes"][number]>;
  side: "yes" | "no";
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = prediction.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getCryptoAboveBelowDrawerInfoLines(
    prediction,
    strike,
    side,
  );
  const iconUrl = prediction.iconUrl.trim();
  const selectedPoolPercent = side === "yes" ? strike.yes.poolPercent : strike.no.poolPercent;

  const inFavor = side === "yes";
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

  return (
    <div className="flex flex-col gap-3">
      <AppDrawerHeading title="Make a prediction" />

      <div className="flex flex-col gap-3 rounded-sm bg-main-grayPurple/80 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-main-darkPurple min-w-0 text-sm leading-tight">{primaryQuestion}</p>
          {selectedPoolPercent != null ? (
            <span className="text-main-darkPurple shrink-0 text-sm tabular-nums">
              {selectedPoolPercent}%
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-main-darkPurple/65 min-w-0 text-xs leading-tight font-medium">
            {secondaryMuted}
          </p>
          <div className="relative h-6 w-6 shrink-0">
            {iconUrl ? (
              isUsdcIconUrl(iconUrl) ? (
                <span className="inline-flex" aria-hidden>
                  <UsdcTokenIcon />
                </span>
              ) : isWUsdcIconUrl(iconUrl) ? (
                <span className="inline-flex" aria-hidden>
                  <WUsdcTokenIcon />
                </span>
              ) : isYtIconUrl(iconUrl) ? (
                <span className="inline-flex" aria-hidden>
                  <YtTokenIcon />
                </span>
              ) : (
                <Image src={iconUrl} alt="" width={24} height={24} className="object-contain" />
              )
            ) : (
              <span className="bg-main-grayPurple block h-6 w-6 rounded-sm" aria-hidden />
            )}
          </div>
        </div>
      </div>

      {!isAvailable && (
        <p className="text-main-darkPurple/80 text-center text-sm leading-5">
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
        <p className="text-main-red text-center text-xs leading-snug" role="alert">
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
