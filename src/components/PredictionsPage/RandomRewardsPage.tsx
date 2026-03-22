"use client";

import { useState } from "react";
import {
  RANDOM_REWARDS_FILTERS,
  type RandomRewardsFilterId,
} from "@/shared/constants/randomRewards";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function RandomRewardsPage() {
  const [filter, setFilter] = useState<RandomRewardsFilterId>("all");

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
        <SectionHeader className="text-main-darkPurple">Random pools</SectionHeader>
      </section>
    </div>
  );
}
