"use client";

import { useState } from "react";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { useCPF } from "@/hooks/useCPF";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";
import {
  usePredictionsDrawerMaxBalance,
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
  const { maxBalance, ytBalance } = usePredictionsDrawerMaxBalance();
  const selectedTeam = side === "team1" ? match.participantA : match.participantB;
  const isAvailable = match.isTradingOpen;
  const game = ESPORTS_GAMES.find((entry) => entry.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";

  const inFavor = side === "team1";
  const { placeBet, isBetPending, betError, betStatus, resetBet, insufficientBalance } = useCPF(
    match.cpfAddress,
    match.cpfPoolId,
    amount,
    inFavor,
    ytBalance,
  );

  const buttonLabel =
    betStatus === "approving"
      ? "Approving…"
      : betStatus === "depositing"
        ? "Placing bet…"
        : betStatus === "success"
          ? "Placed!"
          : undefined;

  const disabled = !isAvailable || isBetPending;
  const canSubmit = !disabled && !insufficientBalance && amount !== "";

  function handleSuccessClose() {
    resetBet();
    onOpenChange(false);
  }

  return (
    <>
      <RequestResultDialog
        open={betStatus === "error"}
        onClose={resetBet}
        title="Bet Failed"
        description={betError ?? "Something went wrong. Please try again."}
      />

      <RequestResultDialog
        open={betStatus === "success"}
        onClose={handleSuccessClose}
        status="success"
        title="Bet Placed"
        description="Your prediction has been placed successfully."
        closeLabel="Done"
      />

      <DrawerShell
        open={open}
        onOpenChange={onOpenChange}
        header={<PredictionsDrawerHeader />}
        footer={
          <PredictionsDrawerPlaceButton
            disabled={!canSubmit}
            onClick={() => void placeBet()}
            label={buttonLabel}
          />
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
            maxBalance={maxBalance}
            priceLabel={formatCryptoPredictionDrawerPrice(selectedTeam.odds)}
            disabled={disabled}
            unavailableMessage={!isAvailable ? "Betting is unavailable for this match." : null}
            errorMessage={betError ?? (insufficientBalance ? "Insufficient YT balance." : null)}
            buttonLabel={buttonLabel}
            onSubmit={() => void placeBet()}
            hideAction
          />
        </PredictionsDrawerTemplate>
      </DrawerShell>
    </>
  );
}
