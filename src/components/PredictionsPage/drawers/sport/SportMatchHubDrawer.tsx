"use client";

import { useState } from "react";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
  PredictionsDrawerPlaceButton,
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
  if (!match || !side) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <SportMatchHubDrawerBody
      key={`${match.id}-${side}`}
      match={match}
      side={side}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function SportMatchHubDrawerBody({
  match,
  side,
  open,
  onOpenChange,
}: {
  match: SportHubMatch;
  side: SportMatchDrawerSide;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const selectedTeam = side === "team1" ? match.participantA : match.participantB;
  const isAvailable = match.isTradingOpen;

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      header={<PredictionsDrawerHeader />}
      footer={
        <PredictionsDrawerPlaceButton disabled={!isAvailable} onClick={() => {}} />
      }
    >
      <PredictionsDrawerTemplate>
        <SportMatchDrawerOutcomeCard match={match} selectedTeam={selectedTeam} />

        <PredictionsDrawerPredictionForm
          amount={amount}
          onAmountChange={setAmount}
          maxBalance={PREDICTIONS_DRAWER_MAX_BALANCE}
          priceLabel={formatCryptoPredictionDrawerPrice(selectedTeam.odds)}
          disabled={!isAvailable}
          unavailableMessage={!isAvailable ? "Betting is unavailable for this match." : null}
          onSubmit={() => {}}
          hideAction
        />
      </PredictionsDrawerTemplate>
    </DrawerShell>
  );
}
