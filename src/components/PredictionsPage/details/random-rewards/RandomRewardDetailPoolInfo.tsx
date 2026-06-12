"use client";

import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type {
  RandomPool,
  RandomPoolLive,
  RandomPoolRemainingTime,
} from "@/shared/types/randomPool";
import { useRandomPoolRemainingCountdown } from "../shared/useRandomPoolRemainingCountdown";
import { RandomRewardsPoolIcon } from "./RandomRewardsPoolIcon";
import { RandomRewardsPoolStatCard } from "./RandomRewardsPoolStatCard";

function LiveRemainingTimeLine({ remainingTime }: { remainingTime: RandomPoolRemainingTime }) {
  const remaining = useRandomPoolRemainingCountdown(remainingTime);
  return (
    <p className="text-main-darkPurple/60 mt-1 text-sm leading-snug">
      {formatRandomPoolRemainingTime(remaining)}
    </p>
  );
}

interface RandomRewardDetailPoolInfoProps {
  pool: RandomPool;
}

export function RandomRewardDetailPoolInfo({ pool }: RandomRewardDetailPoolInfoProps) {
  const livePool = pool.status === "live" ? (pool as RandomPoolLive) : null;

  const secondStat =
    pool.status === "live"
      ? { label: "Expected yield", value: pool.expectedYield }
      : { label: "Yield", value: pool.earnings };

  const thirdStat =
    pool.status === "live"
      ? { label: "Users in pool", value: String(pool.usersIn) }
      : { label: "Users in pool", value: String(pool.usersInPool ?? pool.usersWon) };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-3">
        <RandomRewardsPoolIcon variant="details" iconUrl={pool.iconUrl} alt={pool.title} />
        <div className="min-w-0 flex-1">
          <h1 className="text-main-darkPurple text-lg leading-tight font-medium">{pool.title}</h1>
          {livePool ? (
            <LiveRemainingTimeLine remainingTime={livePool.remainingTime} />
          ) : (
            <p className="text-main-darkPurple/60 mt-1 text-sm leading-snug">Pool lifetime ended</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-start gap-2">
        <RandomRewardsPoolStatCard label="Pool TVL" value={pool.tvl} />
        <RandomRewardsPoolStatCard label={secondStat.label} value={secondStat.value} />
        <RandomRewardsPoolStatCard label={thirdStat.label} value={thirdStat.value} />
      </div>
    </section>
  );
}
