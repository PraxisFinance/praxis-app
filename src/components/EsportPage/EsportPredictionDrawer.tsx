"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { ESPORTS_GAMES } from "@/shared/constants/esports";
import type { EsportsMatch, EsportsMatchTeam } from "@/shared/types/esportsMatch";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import { getEsportsTeamInitials } from "@/shared/utils/esportsTeamDisplay";
import { cn } from "@/lib/utils";

function EsportDrawerTeamInline({ team }: { team: EsportsMatchTeam }) {
  const trimmedUrl = team.logoUrl.trim();
  const showLogo = Boolean(trimmedUrl);
  const initials = getEsportsTeamInitials(team.name);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md bg-main-grayPurple">
        {showLogo ? (
          <Image src={trimmedUrl} alt="" fill className="object-cover" sizes="24px" />
        ) : (
          <span
            className={cn(
              "flex h-full w-full items-center justify-center font-semibold leading-none text-main-darkPurple",
              initials.length <= 2 ? "text-[10px]" : "text-[8px]"
            )}
          >
            {initials}
          </span>
        )}
      </div>
      <span className="truncate text-xs font-medium text-main-darkPurple">{team.name}</span>
    </div>
  );
}

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === "/icons/yt-token.png")?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

interface EsportPredictionDrawerProps {
  match: EsportsMatch | null;
  side: "team1" | "team2" | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EsportPredictionDrawer({
  match,
  side,
  open,
  onOpenChange,
}: EsportPredictionDrawerProps) {
  const resolved = Boolean(match && side);

  return (
    <DrawerShell open={open && resolved} onOpenChange={onOpenChange}>
      {match && side ? (
        <PredictionDrawerBody key={`${match.id}-${side}`} match={match} side={side} />
      ) : null}
    </DrawerShell>
  );
}

function PredictionDrawerBody({ match, side }: { match: EsportsMatch; side: "team1" | "team2" }) {
  const [amount, setAmount] = useState("");
  const selectedTeam = side === "team1" ? match.team1 : match.team2;
  const isAvailable = match.isBettingAvailable;
  const game = ESPORTS_GAMES.find((g) => g.id === match.gameId);
  const gameIconUrl = game?.iconUrl ?? "";

  return (
    <div className="flex flex-col gap-6">
      <AppDrawerHeading title="Make a prediction" />

      <div className="flex flex-col gap-3 rounded-2xl bg-main-grayPurple/80 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-sm font-semibold leading-tight text-main-darkPurple">
            Match outcome: {selectedTeam.name}
          </p>
          <span className="shrink-0 text-sm font-bold tabular-nums text-main-darkPurple">
            {formatEsportsOdds(selectedTeam.odds)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <EsportDrawerTeamInline team={match.team1} />
            <span className="shrink-0 text-xs font-medium text-main-darkPurple/50">—</span>
            <EsportDrawerTeamInline team={match.team2} />
          </div>
          <div className="relative h-6 w-6 shrink-0">
            {gameIconUrl ? (
              <Image src={gameIconUrl} alt="" width={24} height={24} className="object-contain" />
            ) : (
              <span className="block h-6 w-6 rounded-md bg-main-grayPurple" aria-hidden />
            )}
          </div>
        </div>
      </div>

      {!isAvailable && (
        <p className="text-center text-sm leading-5 text-main-darkPurple/80">
          Betting is unavailable for this match.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <InputWithMax
          value={amount}
          onChange={setAmount}
          maxValue={PREDICTION_MAX_BALANCE}
          placeholder="Prediction amount"
          disabled={!isAvailable}
        />
      </div>

      <Button variant="primary" size="action" className="rounded-xl" disabled={!isAvailable}>
        Place prediction
      </Button>
    </div>
  );
}
