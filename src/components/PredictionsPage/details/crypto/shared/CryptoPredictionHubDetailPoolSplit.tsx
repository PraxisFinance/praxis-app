"use client";

import type { PredictionOutcome } from "@/shared/types/predictions";
import { formatHubDetailPoolPercent } from "../../shared/hubDetailFormat";

interface CryptoPredictionHubDetailPoolSplitProps {
  left: PredictionOutcome;
  right: PredictionOutcome;
}

export function CryptoPredictionHubDetailPoolSplit({
  left,
  right,
}: CryptoPredictionHubDetailPoolSplitProps) {
  const leftPercent = left.poolPercent ?? 0;
  const rightPercent = right.poolPercent ?? 0;
  const leftWidth = Math.min(100, Math.max(0, leftPercent));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-main-grayPurple/60 h-2 w-full overflow-hidden rounded-full">
        <div className="bg-main-success h-full rounded-full" style={{ width: `${leftWidth}%` }} />
      </div>
      <div className="flex items-center justify-between text-2xs tabular-nums">
        <span className="text-main-success font-semibold">
          {formatHubDetailPoolPercent(leftPercent)}
        </span>
        <span className="text-main-red font-semibold">
          {formatHubDetailPoolPercent(rightPercent)}
        </span>
      </div>
    </div>
  );
}
