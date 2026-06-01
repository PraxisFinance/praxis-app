import type { PoliticsHubEvent } from "@/shared/types/predictionsHubItem";
import { HubCardShell } from "./HubCardShell";

interface PoliticsEventHubCardProps {
  event: PoliticsHubEvent;
}

export function PoliticsEventHubCard({ event }: PoliticsEventHubCardProps) {
  return <HubCardShell aria-label={`Politics event ${event.id}`} />;
}
