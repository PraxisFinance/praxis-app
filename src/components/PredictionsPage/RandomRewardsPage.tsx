"use client";

import { useState } from "react";
import Image from "next/image";
import { Drawer } from "vaul";
import { RANDOM_POOL_MOCKS } from "@/shared/constants/randomPoolMocks";
import type { RandomPoolLive } from "@/shared/types/randomPool";
import {
  RANDOM_POOLS_HINT,
  RANDOM_REWARDS_FILTERS,
  type RandomRewardsFilterId,
} from "@/shared/constants/randomRewards";
import { RandomPoolItem } from "@/components/PredictionsPage/RandomPoolItem";
import { RandomPoolJoinDrawer } from "@/components/PredictionsPage/RandomPoolJoinDrawer";
import { Button } from "@/components/ui/button";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function RandomRewardsPage() {
  const [filter, setFilter] = useState<RandomRewardsFilterId>("all");
  const [poolsHintOpen, setPoolsHintOpen] = useState(false);
  const [joinPool, setJoinPool] = useState<RandomPoolLive | null>(null);
  const [joinDrawerOpen, setJoinDrawerOpen] = useState(false);

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
                    : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <SectionHeader className="text-main-darkPurple">Random pools</SectionHeader>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPoolsHintOpen(true)}
            className="p-1"
            aria-label="How random pools work"
          >
            <Image src="/icons/question.png" alt="" width={14} height={14} />
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {RANDOM_POOL_MOCKS.map((pool) => (
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
        <Drawer.Title className="text-main-darkPurple text-2xl font-bold leading-tight">
          {RANDOM_POOLS_HINT.title}
        </Drawer.Title>
        <p className="text-main-darkPurple text-sm font-normal leading-5">
          {RANDOM_POOLS_HINT.description}
        </p>
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
