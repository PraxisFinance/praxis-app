"use client";

import type { EsportsGameFilterId } from "@/shared/constants/esports";
import { EsportsGameFilterChip } from "./EsportsGameFilterChip";

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
          <EsportsGameFilterChip
            key={id}
            label={label}
            iconUrl={iconUrl}
            isActive={isActive}
            onClick={() => onChange(isActive ? null : id)}
          />
        );
      })}
    </div>
  );
}
