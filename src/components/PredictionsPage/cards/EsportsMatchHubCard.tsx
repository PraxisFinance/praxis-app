import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { HubCardShell } from "./HubCardShell";

interface EsportsMatchHubCardProps {
  match: EsportsMatch;
}

export function EsportsMatchHubCard({ match }: EsportsMatchHubCardProps) {
  return <HubCardShell aria-label={`Esports match ${match.id}`} />;
}
