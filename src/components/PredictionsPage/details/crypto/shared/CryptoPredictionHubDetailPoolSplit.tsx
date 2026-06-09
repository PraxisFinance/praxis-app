"use client";

import type { CryptoBinaryOutcome } from "@/shared/types/cryptoPrediction";
import { formatHubDetailPoolPercent } from "../../shared/hubDetailFormat";

interface CryptoPredictionHubDetailPoolSplitProps {
  left: CryptoBinaryOutcome;
  right: CryptoBinaryOutcome;
}

export function CryptoPredictionHubDetailPoolSplit({
  left,
  right,
}: CryptoPredictionHubDetailPoolSplitProps) {
  const leftWidth = Math.min(100, Math.max(0, left.poolPercent));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-main-grayPurple/60 h-2 w-full overflow-hidden rounded-full">
        <div className="bg-main-success h-full rounded-full" style={{ width: `${leftWidth}%` }} />
      </div>
      <div className="flex items-center justify-between text-2xs tabular-nums">
        <span className="text-main-success font-semibold">
          {formatHubDetailPoolPercent(left.poolPercent)}
        </span>
        <span className="text-main-red font-semibold">
          {formatHubDetailPoolPercent(right.poolPercent)}
        </span>
      </div>
    </div>
  );
}
