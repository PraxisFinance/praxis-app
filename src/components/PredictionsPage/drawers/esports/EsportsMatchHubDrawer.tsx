"use client";

import { useState } from "react";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
  PredictionsDrawerPlaceButton,
  PredictionsDrawerPredictionForm,
  PredictionsDrawerTemplate,
} from "../shared";
import { formatCryptoPredictionDrawerPrice } from "../crypto/shared";
import { EsportsMatchDrawerOutcomeCard } from "./shared";
import type { EsportsMatchDrawerSide } from "./useEsportsMatchDrawer";

export interface EsportsMatchHubDrawerProps {
  match: EsportsMatch | null;
  side: EsportsMatchDrawerSide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EsportsMatchHubDrawer({ match, side, open, onOpenChange }: EsportsMatchHubDrawerProps) {
  if (!match || !side) {
    return <DrawerShell open={false} onOpenChange={onOpenChange}>{null}</DrawerShell>;
  }

  return (
    <EsportsMatchHubDrawerBody
      key={`${match.id}-${side}`}
      match={match}
      side={side}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

function EsportsMatchHubDrawerBody({
  match,
  side,
  open,
  onOpenChange,
}: {
  match: EsportsMatch;
  side: EsportsMatchDrawerSide;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const selectedTeam = side === "team1" ? match.participantA : match.participantB;
  const isAvailable = match.isTradingOpen;
  const game = ESPORTS_GAMES.find((entry) => entry.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";

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
        <EsportsMatchDrawerOutcomeCard
          match={match}
          selectedTeam={selectedTeam}
          gameIconUrl={gameIconUrl}
        />

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
