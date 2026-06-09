"use client";

import { useState } from "react";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { PredictionsDrawerTitle } from "../shared";
import {
  CryptoPredictionDrawerForm,
  formatCryptoPredictionDrawerPrice,
} from "../crypto/shared";
import { SportMatchDrawerOutcomeCard } from "./shared";
import type { SportMatchDrawerSide } from "./useSportMatchDrawer";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === YT_ICON_URL)?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

export interface SportMatchHubDrawerProps {
  match: SportHubMatch | null;
  side: SportMatchDrawerSide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SportMatchHubDrawer({ match, side, open, onOpenChange }: SportMatchHubDrawerProps) {
  const resolved = Boolean(match && side);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {match && side ? (
        <SportMatchHubDrawerBody key={`${match.id}-${side}`} match={match} side={side} />
      ) : null}
    </DrawerShell>
  );
}

function SportMatchHubDrawerBody({
  match,
  side,
}: {
  match: SportHubMatch;
  side: SportMatchDrawerSide;
}) {
  const [amount, setAmount] = useState("");
  const selectedTeam = side === "team1" ? match.team1 : match.team2;
  const isAvailable = match.isBettingAvailable;

  return (
    <div className="flex flex-col gap-4">
      <PredictionsDrawerTitle />

      <SportMatchDrawerOutcomeCard match={match} selectedTeam={selectedTeam} />

      <CryptoPredictionDrawerForm
        amount={amount}
        onAmountChange={setAmount}
        maxBalance={PREDICTION_MAX_BALANCE}
        priceLabel={formatCryptoPredictionDrawerPrice(selectedTeam.odds)}
        disabled={!isAvailable}
        unavailableMessage={!isAvailable ? "Betting is unavailable for this match." : null}
        buttonLabel="Place prediction"
        onSubmit={() => {}}
      />
    </div>
  );
}
