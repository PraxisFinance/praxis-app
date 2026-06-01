import type { RandomPool } from "@/shared/types/randomPool";
import { HubCardShell } from "./HubCardShell";

interface RandomRewardHubCardProps {
  pool: RandomPool;
}

export function RandomRewardHubCard({ pool }: RandomRewardHubCardProps) {
  return <HubCardShell aria-label={`Random rewards pool ${pool.id}`} />;
}
