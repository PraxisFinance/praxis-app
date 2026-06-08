"use client";

import type { TechHubEvent } from "@/shared/types/techHubEvent";
import { HubDetailShell } from "../HubDetailShell";

interface TechEventHubDetailProps {
  event: TechHubEvent;
}

export function TechEventHubDetail({ event }: TechEventHubDetailProps) {
  return (
    <HubDetailShell aria-label={`Tech event detail ${event.id}`}>
      <p className="text-main-darkPurple text-sm font-medium">{event.title}</p>
    </HubDetailShell>
  );
}
