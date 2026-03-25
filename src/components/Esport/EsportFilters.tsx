"use client";

import Image from "next/image";
import {
  ESPORTS_GAMES,
  ESPORTS_TIME_FILTERS,
  type EsportsGameFilterId,
  type EsportsTimeFilterId,
} from "@/shared/constants/esports";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface EsportFiltersProps {
  selectedGameIds: EsportsGameFilterId[];
  onGameSelectionChange: (ids: EsportsGameFilterId[]) => void;
  timeId: EsportsTimeFilterId | null;
  onTimeChange: (id: EsportsTimeFilterId | null) => void;
}

export function EsportFilters({
  selectedGameIds,
  onGameSelectionChange,
  timeId,
  onTimeChange,
}: EsportFiltersProps) {
  const toggleGame = (id: EsportsGameFilterId) => {
    if (selectedGameIds.includes(id)) {
      onGameSelectionChange(selectedGameIds.filter((g) => g !== id));
    } else {
      onGameSelectionChange([...selectedGameIds, id]);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader className="text-main-darkPurple">Filters</SectionHeader>

      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Esports games"
      >
        {ESPORTS_GAMES.map(({ id, label, iconUrl }) => {
          const isActive = selectedGameIds.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleGame(id)}
              className={cn(
                "flex min-w-[76px] shrink-0 flex-col items-center justify-center gap-2 rounded-sm px-2 py-2 transition-all",
                isActive
                  ? "bg-main-purple text-white"
                  : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
              )}
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                {iconUrl ? (
                  <Image src={iconUrl} alt="" width={40} height={40} className="object-contain" />
                ) : (
                  <span
                    className={cn(
                      "block h-10 w-10 rounded-lg",
                      isActive ? "bg-white/20" : "bg-main-grayPurple/35"
                    )}
                    aria-hidden
                  />
                )}
              </span>
              <span className="max-w-[88px] text-center text-[10px] font-medium leading-tight tracking-wide">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Esports time filters">
        {ESPORTS_TIME_FILTERS.map(({ id, label }) => {
          const isActive = timeId === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTimeChange(timeId === id ? null : id)}
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
  );
}
