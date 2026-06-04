"use client";

import type { CryptoStrikeBinary } from "@/shared/types/cryptoPrediction";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import { cn } from "@/lib/utils";

export interface CryptoPredictionHubStrikeRowProps {
  strike: CryptoStrikeBinary;
  disabled: boolean;
}

export function CryptoPredictionHubStrikeRow({
  strike,
  disabled,
}: CryptoPredictionHubStrikeRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-main-darkPurple min-w-0 flex-1 truncate text-xs font-medium">
        {strike.targetLabel}
      </span>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "text-main-darkGreen shrink-0 rounded-md bg-main-lightGreen px-2.5 py-1.5 text-2xs font-semibold transition-opacity",
          disabled ? "opacity-45" : "hover:opacity-90",
        )}
      >
        Yes {formatEsportsOdds(strike.yes.odds)}
      </button>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "text-main-red shrink-0 rounded-md bg-main-red/15 px-2.5 py-1.5 text-2xs font-semibold transition-opacity",
          disabled ? "opacity-45" : "hover:opacity-90",
        )}
      >
        No {formatEsportsOdds(strike.no.odds)}
      </button>
    </div>
  );
}
