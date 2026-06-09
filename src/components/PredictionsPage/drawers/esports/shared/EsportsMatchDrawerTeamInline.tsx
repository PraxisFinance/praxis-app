"use client";

import Image from "next/image";
import type { EsportsMatchTeam } from "@/shared/types/esportsMatch";
import { getEsportsTeamInitials } from "@/shared/utils/esportsTeamDisplay";
import { cn } from "@/lib/utils";

interface EsportsMatchDrawerTeamInlineProps {
  team: EsportsMatchTeam;
}

export function EsportsMatchDrawerTeamInline({ team }: EsportsMatchDrawerTeamInlineProps) {
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
              "text-main-darkPurple flex h-full w-full items-center justify-center font-semibold leading-none",
              initials.length <= 2 ? "text-[10px]" : "text-[8px]",
            )}
          >
            {initials}
          </span>
        )}
      </div>
      <span className="text-main-darkPurple truncate text-xs font-medium">{team.name}</span>
    </div>
  );
}
