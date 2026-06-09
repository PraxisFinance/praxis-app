"use client";

import { useState } from "react";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { PredictionsDrawerTitle } from "../shared";
import {
  CryptoPredictionDrawerForm,
  formatCryptoPredictionDrawerPrice,
} from "../crypto/shared";
import { EsportsMatchDrawerOutcomeCard } from "./shared";
import type { EsportsMatchDrawerSide } from "./useEsportsMatchDrawer";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === YT_ICON_URL)?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

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
    <div className="flex flex-col gap-4">
      <PredictionsDrawerTitle />

      <EsportsMatchDrawerOutcomeCard
        match={match}
        selectedTeam={selectedTeam}
        gameIconUrl={gameIconUrl}
      />

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
