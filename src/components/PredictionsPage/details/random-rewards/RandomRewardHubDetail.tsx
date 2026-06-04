"use client";

import type { RandomPool } from "@/shared/types/randomPool";
import { HubDetailShell } from "../HubDetailShell";

interface RandomRewardHubDetailProps {
  pool: RandomPool;
}

export function RandomRewardHubDetail({ pool }: RandomRewardHubDetailProps) {
  return (
    <HubDetailShell aria-label={`Random reward detail ${pool.id}`}>
      <p className="text-main-darkPurple text-sm font-medium">{pool.title}</p>
    </HubDetailShell>
  );
}
