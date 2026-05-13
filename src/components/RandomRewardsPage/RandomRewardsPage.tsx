"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import type { RandomPoolLive } from "@/shared/types/randomPool";
import { HintIcon } from "@/components/icons/base";
import {
  RANDOM_POOLS_HINT,
  RANDOM_REWARDS_FILTERS,
  type RandomRewardsFilterId,
} from "@/shared/constants/randomRewards";
import { useRYDStore } from "@/stores/rydStore";
import { rydDataToRandomPool, filterRydPools } from "@/shared/utils/rydMappers";
import { RandomPoolItem } from "./RandomPoolItem";
import { RandomPoolJoinDrawer } from "./RandomPoolJoinDrawer";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function RandomRewardsPage() {
  const { address } = useAccount();
  const { ryds, loading, fetchAll } = useRYDStore();

  const [filter, setFilter] = useState<RandomRewardsFilterId>("all");
  const [poolsHintOpen, setPoolsHintOpen] = useState(false);
  const [joinPool, setJoinPool] = useState<RandomPoolLive | null>(null);
  const [joinDrawerOpen, setJoinDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAll(address);
  }, [address, fetchAll]);

  const allPools = useMemo(
    () =>
      Object.values(ryds)
        .map(rydDataToRandomPool)
        .filter((p): p is NonNullable<typeof p> => p !== null),
    [ryds],
  );

  const visiblePools = useMemo(() => filterRydPools(allPools, filter), [allPools, filter]);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Filters</SectionHeader>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Random rewards filters">
          {RANDOM_REWARDS_FILTERS.map(({ id, label }) => {
            const isActive = filter === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(id)}
                className={cn(
                  "px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all",
                  isActive
                    ? "bg-main-purple text-white"
                    : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex items-center">
          <SectionHeader className="text-main-darkPurple">Random pools</SectionHeader>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPoolsHintOpen(true)}
            className="p-1"
            aria-label="How random pools work"
          >
            <HintIcon className="text-main-darkPurple h-3.5 w-3.5" aria-hidden />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {loading && visiblePools.length === 0 && (
            <p className="px-1 text-sm text-gray-400">Loading pools…</p>
          )}
          {!loading && visiblePools.length === 0 && (
            <p className="px-1 text-sm text-gray-400">No pools found</p>
          )}
          {visiblePools.map((pool) => (
            <RandomPoolItem
              key={pool.id}
              pool={pool}
              onJoin={
                pool.status === "live"
                  ? () => {
                      setJoinPool(pool);
                      setJoinDrawerOpen(true);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      <DrawerShell open={poolsHintOpen} onOpenChange={setPoolsHintOpen}>
        <AppDrawerHeading
          title={RANDOM_POOLS_HINT.title}
          description={RANDOM_POOLS_HINT.description}
        />
      </DrawerShell>

      <RandomPoolJoinDrawer
        pool={joinPool}
        open={joinDrawerOpen}
        onOpenChange={(next) => {
          setJoinDrawerOpen(next);
          if (!next) setJoinPool(null);
        }}
      />
    </div>
  );
}
