"use client";

import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { HubDetailShell } from "../HubDetailShell";

interface FinanceEventHubDetailProps {
  event: FinanceHubEvent;
}

export function FinanceEventHubDetail({ event }: FinanceEventHubDetailProps) {
  return (
    <HubDetailShell aria-label={`Finance event detail ${event.id}`}>
      <p className="text-main-darkPurple text-sm font-medium">{event.title}</p>
    </HubDetailShell>
  );
}
