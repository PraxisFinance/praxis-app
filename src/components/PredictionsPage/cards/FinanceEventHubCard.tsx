import type { FinanceHubEvent } from "@/shared/types/predictionsHubItem";
import { HubCardShell } from "./HubCardShell";

interface FinanceEventHubCardProps {
  event: FinanceHubEvent;
}

export function FinanceEventHubCard({ event }: FinanceEventHubCardProps) {
  return <HubCardShell aria-label={`Finance event ${event.id}`} />;
}
