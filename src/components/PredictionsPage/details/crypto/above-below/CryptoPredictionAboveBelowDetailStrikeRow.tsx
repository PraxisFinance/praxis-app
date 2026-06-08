"use client";

import type { CryptoStrikeBinary } from "@/shared/types/cryptoPrediction";
import { formatStrikeProbabilityLabel } from "@/shared/utils/cryptoHubFormat";
import { Button } from "@/components/ui/button";

interface CryptoPredictionAboveBelowDetailStrikeRowProps {
  strike: CryptoStrikeBinary;
  disabled: boolean;
  onPickYes?: (strikeId: string) => void;
  onPickNo?: (strikeId: string) => void;
}

const detailButtonClassName = "h-full text-2xs text-white";

export function CryptoPredictionAboveBelowDetailStrikeRow({
  strike,
  disabled,
  onPickYes,
  onPickNo,
}: CryptoPredictionAboveBelowDetailStrikeRowProps) {
  const probabilityLabel = formatStrikeProbabilityLabel(strike.yes.poolPercent);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-main-darkPurple text-sm font-medium">{strike.targetLabel}</span>
        <span className="text-main-darkPurple/70 text-2xs shrink-0 font-semibold tabular-nums">
          {probabilityLabel}
        </span>
      </div>

      <div className="flex gap-3">
        <div className="h-7 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className={detailButtonClassName}
            onClick={() => onPickYes?.(strike.id)}
          >
            Yes
          </Button>
        </div>
        <div className="h-7 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className={detailButtonClassName}
            onClick={() => onPickNo?.(strike.id)}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}
