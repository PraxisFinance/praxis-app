"use client";

import { useState } from "react";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { DrawerShell } from "@/components/ui/DrawerShell";
import {
  PREDICTIONS_DRAWER_MAX_BALANCE,
  PredictionsDrawerHeader,
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
  const resolved = Boolean(match && side);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {match && side ? (
        <EsportsMatchHubDrawerBody key={`${match.id}-${side}`} match={match} side={side} />
      ) : null}
    </DrawerShell>
  );
}

function EsportsMatchHubDrawerBody({
  match,
  side,
}: {
  match: EsportsMatch;
  side: EsportsMatchDrawerSide;
}) {
  const [amount, setAmount] = useState("");
  const selectedTeam = side === "team1" ? match.team1 : match.team2;
  const isAvailable = match.isBettingAvailable;
  const game = ESPORTS_GAMES.find((entry) => entry.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";

  return (
    <PredictionsDrawerTemplate header={<PredictionsDrawerHeader />}>
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
      />
    </PredictionsDrawerTemplate>
  );
}
