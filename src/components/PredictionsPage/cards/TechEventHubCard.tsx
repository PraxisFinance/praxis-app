import type { TechHubEvent } from "@/shared/types/predictionsHubItem";
import { HubCardShell } from "./HubCardShell";

interface TechEventHubCardProps {
  event: TechHubEvent;
}

export function TechEventHubCard({ event }: TechEventHubCardProps) {
  return <HubCardShell aria-label={`Tech event ${event.id}`} />;
}
