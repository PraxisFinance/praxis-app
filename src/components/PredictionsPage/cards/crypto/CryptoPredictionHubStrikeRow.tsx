"use client";

import type { CryptoStrikeBinary } from "@/shared/types/cryptoPrediction";
import { formatStrikeProbabilityLabel } from "@/shared/utils/cryptoHubFormat";
import { Button } from "@/components/ui/button";
import { stopHubCardLinkNavigation } from "../stopHubCardLinkNavigation";

export interface CryptoPredictionHubStrikeRowProps {
  strike: CryptoStrikeBinary;
  disabled: boolean;
  onPickYes?: (strikeId: string) => void;
  onPickNo?: (strikeId: string) => void;
}

const strikeButtonClassName =
  "h-7 min-w-[52px] shrink-0 px-2.5 text-2xs font-semibold text-white";

export function CryptoPredictionHubStrikeRow({
  strike,
  disabled,
  onPickYes,
  onPickNo,
}: CryptoPredictionHubStrikeRowProps) {
  const probabilityLabel = formatStrikeProbabilityLabel(strike.yes.poolPercent);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <span className="text-main-darkPurple text-xs font-medium">{strike.targetLabel}</span>
      <div className="flex items-center gap-2">
        <span className="text-main-darkPurple w-10 shrink-0 text-right text-2xs font-semibold tabular-nums">
          {probabilityLabel}
        </span>
        <Button
          type="button"
          variant="success"
          disabled={disabled}
          className={strikeButtonClassName}
          onClick={(event) => {
            stopHubCardLinkNavigation(event);
            onPickYes?.(strike.id);
          }}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant="destructiveMuted"
          disabled={disabled}
          className={strikeButtonClassName}
          onClick={(event) => {
            stopHubCardLinkNavigation(event);
            onPickNo?.(strike.id);
          }}
        >
          No
        </Button>
      </div>
    </div>
  );
}
