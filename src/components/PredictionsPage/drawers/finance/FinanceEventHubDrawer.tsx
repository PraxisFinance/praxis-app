"use client";

import { useState } from "react";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { FinanceHubBinaryOutcome, FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { getFinanceDrawerInfoLines } from "@/shared/utils/financeHubEventFormat";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  CryptoPredictionDrawerForm,
  CryptoPredictionDrawerOutcomeCard,
  formatCryptoPredictionDrawerPrice,
} from "../crypto/shared";
import { FinanceEventDrawerHeading } from "./shared";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === YT_ICON_URL)?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

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
  const resolved = Boolean(event && selectedOutcome);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {event && selectedOutcome ? (
        <FinanceEventHubDrawerBody
          key={`${event.id}-${selectedOutcome.id}`}
          event={event}
          selectedOutcome={selectedOutcome}
        />
      ) : null}
    </DrawerShell>
  );
}

function FinanceEventHubDrawerBody({
  event,
  selectedOutcome,
}: {
  event: FinanceHubEvent;
  selectedOutcome: FinanceHubBinaryOutcome;
}) {
  const [amount, setAmount] = useState("");
  const isAvailable = event.isTradingOpen;
  const { primaryQuestion, secondaryMuted } = getFinanceDrawerInfoLines(event, selectedOutcome.label);

  return (
    <div className="flex flex-col gap-2">
      <FinanceEventDrawerHeading logoUrl={event.logoUrl} />

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
        disabled={!isAvailable}
        unavailableMessage={!isAvailable ? "Predictions are unavailable for this market." : null}
        buttonLabel="Place prediction"
        onSubmit={() => {}}
      />
    </div>
  );
}
