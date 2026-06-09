"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type { RandomPool } from "@/shared/types/randomPool";
import { stopHubCardLinkNavigation } from "../stopHubCardLinkNavigation";
import { RandomPoolHubIcon } from "./RandomPoolHubIcon";

export interface RandomRewardHubCardProps {
  pool: RandomPool;
  onJoin?: () => void;
  onClaim?: () => void;
}

export function RandomRewardHubCard({ pool, onJoin, onClaim }: RandomRewardHubCardProps) {
  const isLive = pool.status === "live";

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-2 rounded-[10px] p-3">
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <RandomPoolHubIcon iconUrl={pool.iconUrl} alt={pool.title} />
          <h3 className="text-main-darkPurple truncate text-base leading-5">{pool.title}</h3>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {!isLive ? (
            <>
              <span className="text-main-darkPurple text-2xs font-medium uppercase tracking-wide">
                Ended
              </span>
              {pool.userWon ? (
                <span className="rounded-[4px] bg-main-success px-2 py-0.5 text-2xs">You won</span>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        <StatBadge label="TVL" value={pool.tvl} />
        {isLive ? (
          <>
            <StatBadge label="Expected yield" value={pool.expectedYield} />
            <StatBadge label="Users in" value={String(pool.usersIn)} />
          </>
        ) : (
          <>
            <StatBadge label="Earnings" value={pool.earnings} />
            <StatBadge label="Users won" value={String(pool.usersWon)} />
          </>
        )}
      </div>

      <ProgressBar value={pool.progressPercent} variant={isLive ? "live" : "ended"} />

      {isLive ? (
        <div className="flex items-center justify-between gap-1.5 text-2xs leading-tight">
          <div className="flex items-center gap-1 text-main-darkPurple">
            <span className="text-main-red" aria-hidden>
              ●
            </span>
            <span className="font-medium">Live now</span>
          </div>
          <span className="text-main-darkPurple/80 text-right">
            {formatRandomPoolRemainingTime(pool.remainingTime)}
          </span>
        </div>
      ) : null}

      {isLive ? (
        <Button
          type="button"
          variant="success"
          size="action"
          className="h-8 text-white"
          onClick={(event) => {
            stopHubCardLinkNavigation(event);
            onJoin?.();
          }}
        >
          Join now
        </Button>
      ) : pool.userWon ? (
        <Button
          type="button"
          variant="primary"
          size="action"
          className="h-8 text-white"
          onClick={(event) => {
            stopHubCardLinkNavigation(event);
            onClaim?.();
          }}
        >
          Claim rewards
        </Button>
      ) : (
        <Button type="button" variant="secondaryBrand" size="action" className="h-8" disabled>
          Pool lifetime ended
        </Button>
      )}
    </article>
  );
}
