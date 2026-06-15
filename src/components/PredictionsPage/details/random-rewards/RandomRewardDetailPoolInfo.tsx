"use client";

import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type { RandomPool, RandomPoolRemainingTime } from "@/shared/types/randomPool";
import { isRandomRewardsEndedCard, isRandomRewardsLiveCard } from "@/shared/types/predictions";
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
  if (isRandomRewardsLiveCard(pool)) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex gap-3">
          <RandomRewardsPoolIcon variant="details" iconUrl={pool.iconUrl} alt={pool.title} />
          <div className="min-w-0 flex-1">
            <h1 className="text-main-darkPurple text-lg leading-tight font-medium">{pool.title}</h1>
            <LiveRemainingTimeLine remainingTime={pool.remainingTime} />
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-start gap-2">
          <RandomRewardsPoolStatCard label="Pool TVL" value={pool.tvl} />
          <RandomRewardsPoolStatCard label="Expected yield" value={pool.expectedYield} />
          <RandomRewardsPoolStatCard label="Users in pool" value={String(pool.usersIn)} />
        </div>
      </section>
    );
  }

  if (!isRandomRewardsEndedCard(pool)) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-3">
        <RandomRewardsPoolIcon variant="details" iconUrl={pool.iconUrl} alt={pool.title} />
        <div className="min-w-0 flex-1">
          <h1 className="text-main-darkPurple text-lg leading-tight font-medium">{pool.title}</h1>
          <p className="text-main-darkPurple/60 mt-1 text-sm leading-snug">Pool lifetime ended</p>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-start gap-2">
        <RandomRewardsPoolStatCard label="Pool TVL" value={pool.tvl} />
        <RandomRewardsPoolStatCard label="Yield" value={pool.earnings} />
        <RandomRewardsPoolStatCard
          label="Users in pool"
          value={String(pool.usersInPool ?? pool.usersWon)}
        />
      </div>
    </section>
  );
}
