"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type { RandomPool } from "@/shared/types/randomPool";

export interface RandomPoolItemProps {
  pool: RandomPool;
  onJoin?: () => void;
  onClaim?: () => void;
}

export function RandomPoolItem({ pool, onJoin, onClaim }: RandomPoolItemProps) {
  const router = useRouter();
  const isLive = pool.status === "live";
  const detailHref = `/predictions/random-rewards/${pool.id}`;

  return (
    <Card
      role="link"
      tabIndex={0}
      className="cursor-pointer gap-2 p-3 transition-opacity hover:opacity-95"
      onClick={() => router.push(detailHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(detailHref);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-amber-100/80">
            {pool.iconUrl ? (
              <Image
                src={pool.iconUrl}
                alt={pool.title}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg">🪙</div>
            )}
          </div>
          <h3 className="text-main-darkPurple truncate text-base leading-5">
            {pool.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {!isLive && (
            <>
              <span className="text-main-darkPurple text-2xs font-medium uppercase tracking-wide">
                Ended
              </span>
              {pool.userWon && (
                <span className="rounded-[4px] bg-main-success px-2 py-0.5 text-2xs">
                  You won
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stats */}
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

      {/* Status row — live only */}
      {isLive && (
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
      )}

      {/* Actions */}
      {isLive ? (
        <Button
          type="button"
          variant="success"
          size="action"
          className="bg-main-success/90 hover:bg-main-success"
          onClick={(e) => {
            e.stopPropagation();
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
          onClick={(e) => {
            e.stopPropagation();
            onClaim?.();
          }}
        >
          Claim rewards
        </Button>
      ) : (
        <Button type="button" variant="secondaryBrand" size="action" disabled>
          Pool lifetime ended
        </Button>
      )}
    </Card>
  );
}
