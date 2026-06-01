import type { TwoPool } from "@/shared/types/twoPool";
import { HubCardShell } from "./HubCardShell";

interface TwoPoolHubCardProps {
  pool: TwoPool;
}

export function TwoPoolHubCard({ pool }: TwoPoolHubCardProps) {
  return <HubCardShell aria-label={`Two-Pool ${pool.id}`} />;
}
