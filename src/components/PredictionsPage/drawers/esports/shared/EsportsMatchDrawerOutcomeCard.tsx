"use client";

import Image from "next/image";
import type { EsportsMatch, EsportsMatchTeam } from "@/shared/types/esportsMatch";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import { EsportsMatchDrawerTeamInline } from "./EsportsMatchDrawerTeamInline";

interface EsportsMatchDrawerOutcomeCardProps {
  match: EsportsMatch;
  selectedTeam: EsportsMatchTeam;
  gameIconUrl: string;
}

export function EsportsMatchDrawerOutcomeCard({
  match,
  selectedTeam,
  gameIconUrl,
}: EsportsMatchDrawerOutcomeCardProps) {
  return (
    <div className="bg-main-grayPurple/80 flex flex-col gap-2 rounded-[10px] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-main-darkPurple min-w-0 text-sm leading-snug font-semibold">
          Match outcome: {selectedTeam.name}
        </p>
        <span className="text-main-darkPurple shrink-0 text-sm font-semibold tabular-nums">
          {formatEsportsOdds(selectedTeam.odds)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <EsportsMatchDrawerTeamInline team={match.participantA} />
          <span className="text-main-darkPurple/50 shrink-0 text-xs font-medium">—</span>
          <EsportsMatchDrawerTeamInline team={match.participantB} />
        </div>
        <div className="relative h-6 w-6 shrink-0">
          {gameIconUrl ? (
            <Image src={gameIconUrl} alt="" width={24} height={24} className="object-contain" />
          ) : (
            <span className="bg-main-grayPurple block h-6 w-6 rounded-md" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
