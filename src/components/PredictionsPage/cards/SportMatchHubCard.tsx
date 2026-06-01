import type { SportHubMatch } from "@/shared/types/predictionsHubItem";
import { HubCardShell } from "./HubCardShell";

interface SportMatchHubCardProps {
  match: SportHubMatch;
}

export function SportMatchHubCard({ match }: SportMatchHubCardProps) {
  return <HubCardShell aria-label={`Sport match ${match.id}`} />;
}
