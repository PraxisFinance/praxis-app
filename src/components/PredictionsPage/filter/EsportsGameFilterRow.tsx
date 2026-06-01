"use client";

import Image from "next/image";
import type { EsportsGameFilterId } from "@/shared/constants/esports";
import { cn } from "@/lib/utils";

export interface EsportsGameFilterOption {
  id: EsportsGameFilterId;
  label: string;
  iconUrl?: string;
}

interface EsportsGameFilterRowProps {
  games: readonly EsportsGameFilterOption[];
  value: EsportsGameFilterId | null;
  onChange: (id: EsportsGameFilterId | null) => void;
}

export function EsportsGameFilterRow({ games, value, onChange }: EsportsGameFilterRowProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Esports games"
    >
      {games.map(({ id, label, iconUrl }) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : id)}
            className={cn(
              "flex min-w-[76px] shrink-0 flex-col items-center justify-center gap-2 rounded-sm px-2 py-2 transition-all",
              isActive
                ? "bg-main-purple text-white"
                : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple",
            )}
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              {iconUrl ? (
                <Image src={iconUrl} alt="" width={40} height={40} className="object-contain" />
              ) : (
                <span
                  className={cn(
                    "block h-10 w-10 rounded-lg",
                    isActive ? "bg-white/20" : "bg-main-grayPurple/35",
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
  );
}
