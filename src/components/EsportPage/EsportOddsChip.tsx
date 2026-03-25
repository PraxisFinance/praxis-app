"use client";

import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import { cn } from "@/lib/utils";

const chipClassName =
  "flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg bg-main-grayPurple px-3 py-2.5";

interface EsportOddsChipProps {
  /** Kept for API / future layout refactor; also exposed as `data-side`. */
  side: "T1" | "T2";
  teamName: string;
  odds: number;
  onPress?: () => void;
  disabled?: boolean;
}

export function EsportOddsChip({
  side,
  teamName,
  odds,
  onPress,
  disabled = false,
}: EsportOddsChipProps) {
  const label = (
    <span className="text-main-darkPurple min-w-0 truncate text-xs font-semibold">{teamName}</span>
  );
  const coeff = (
    <span className="text-main-darkPurple shrink-0 text-sm font-semibold tabular-nums">
      {formatEsportsOdds(odds)}
    </span>
  );

  if (onPress) {
    return (
      <button
        type="button"
        data-side={side}
        disabled={disabled}
        onClick={onPress}
        className={cn(
          chipClassName,
          "text-left outline-none transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-45"
        )}
      >
        {label}
        {coeff}
      </button>
    );
  }

  return (
    <div data-side={side} className={chipClassName}>
      {label}
      {coeff}
    </div>
  );
}
