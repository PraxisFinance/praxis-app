"use client";

import { useState } from "react";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
  PredictionsDrawerPredictionForm,
  PredictionsDrawerTemplate,
} from "../shared";
import { formatCryptoPredictionDrawerPrice } from "../crypto/shared";
import { SportMatchDrawerOutcomeCard } from "./shared";
import type { SportMatchDrawerSide } from "./useSportMatchDrawer";

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
    <PredictionsDrawerTemplate header={<PredictionsDrawerHeader />}>
      <SportMatchDrawerOutcomeCard match={match} selectedTeam={selectedTeam} />

      <PredictionsDrawerPredictionForm
        amount={amount}
        onAmountChange={setAmount}
        maxBalance={PREDICTIONS_DRAWER_MAX_BALANCE}
        priceLabel={formatCryptoPredictionDrawerPrice(selectedTeam.odds)}
        disabled={!isAvailable}
        unavailableMessage={!isAvailable ? "Betting is unavailable for this match." : null}
        onSubmit={() => {}}
      />
    </PredictionsDrawerTemplate>
  );
}
