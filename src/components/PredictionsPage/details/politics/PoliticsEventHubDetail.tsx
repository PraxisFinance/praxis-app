"use client";

import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import { HubDetailShell } from "../HubDetailShell";

interface PoliticsEventHubDetailProps {
  event: PoliticsHubEvent;
}

export function PoliticsEventHubDetail({ event }: PoliticsEventHubDetailProps) {
  return (
    <HubDetailShell aria-label={`Politics event detail ${event.id}`}>
      <p className="text-main-darkPurple text-sm font-medium">{event.title}</p>
    </HubDetailShell>
  );
}
