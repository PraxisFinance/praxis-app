"use client";

import type { CryptoStrikeBinary } from "@/shared/types/cryptoPrediction";
import { formatStrikeProbabilityLabel } from "@/shared/utils/cryptoHubFormat";
import { Button } from "@/components/ui/button";

export interface CryptoPredictionHubStrikeRowProps {
  strike: CryptoStrikeBinary;
  disabled: boolean;
}

const strikeButtonClassName =
  "text-main-darkPurple h-8 min-w-[52px] shrink-0 px-2.5 text-2xs font-semibold";

export function CryptoPredictionHubStrikeRow({
  strike,
  disabled,
}: CryptoPredictionHubStrikeRowProps) {
  const probabilityLabel = formatStrikeProbabilityLabel(strike.yes.poolPercent);

  return (
    <div className="flex items-center gap-2">
      <span className="text-main-darkPurple min-w-0 flex-1 text-xs font-medium">
        {strike.targetLabel}
      </span>
      <span className="text-main-darkPurple w-10 shrink-0 text-right text-2xs font-semibold tabular-nums">
        {probabilityLabel}
      </span>
      <Button
        type="button"
        variant="success"
        disabled={disabled}
        className={strikeButtonClassName}
      >
        Yes
      </Button>
      <Button
        type="button"
        variant="destructiveMuted"
        disabled={disabled}
        className={strikeButtonClassName}
      >
        No
      </Button>
    </div>
  );
}
