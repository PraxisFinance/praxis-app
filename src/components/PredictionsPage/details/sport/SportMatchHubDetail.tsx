"use client";

import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import { HubDetailShell } from "../HubDetailShell";

interface SportMatchHubDetailProps {
  match: SportHubMatch;
}

export function SportMatchHubDetail({ match }: SportMatchHubDetailProps) {
  const title = `${match.team1.name} vs ${match.team2.name}`;

  return (
    <HubDetailShell aria-label={`Sport match detail ${match.id}`}>
      <p className="text-main-darkPurple text-sm font-medium">{title}</p>
    </HubDetailShell>
  );
}
