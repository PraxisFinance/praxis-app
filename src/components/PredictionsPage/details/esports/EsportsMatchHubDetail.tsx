"use client";

import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { HubDetailShell } from "../HubDetailShell";

interface EsportsMatchHubDetailProps {
  match: EsportsMatch;
}

export function EsportsMatchHubDetail({ match }: EsportsMatchHubDetailProps) {
  const title = `${match.team1.name} vs ${match.team2.name}`;

  return (
    <HubDetailShell aria-label={`Esports match detail ${match.id}`}>
      <p className="text-main-darkPurple text-sm font-medium">{title}</p>
    </HubDetailShell>
  );
}
