"use client";

import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type { RandomPool } from "@/shared/types/randomPool";
import { RandomPoolIcon } from "./RandomPoolIcon";
import { RandomPoolStatCard } from "./RandomPoolStatCard";

export interface RandomPoolMainDataProps {
  pool: RandomPool;
}

export function RandomPoolMainData({ pool }: RandomPoolMainDataProps) {
  const subtitle =
    pool.status === "live"
      ? formatRandomPoolRemainingTime(pool.remainingTime)
      : "Pool lifetime ended";

  const secondStat =
    pool.status === "live"
      ? { label: "Expected yield", value: pool.expectedYield }
      : { label: "Yield", value: pool.earnings };

  const thirdStat =
    pool.status === "live"
      ? { label: "Users in pool", value: String(pool.usersIn) }
      : { label: "Users in pool", value: String(pool.usersInPool ?? pool.usersWon) };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <RandomPoolIcon variant="details" iconUrl={pool.iconUrl} alt={pool.title} />
        <div className="min-w-0 flex-1">
          <h1 className="text-main-darkPurple text-lg leading-tight">{pool.title}</h1>
          <p className="text-main-darkPurple/60 mt-1 text-sm leading-snug">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-start gap-2">
        <RandomPoolStatCard label="Pool TVL" value={pool.tvl} />
        <RandomPoolStatCard label={secondStat.label} value={secondStat.value} />
        <RandomPoolStatCard label={thirdStat.label} value={thirdStat.value} />
      </div>
    </div>
  );
}
