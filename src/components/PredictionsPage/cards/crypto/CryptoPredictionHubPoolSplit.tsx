"use client";

import type { PredictionOutcome } from "@/shared/types/predictions";

interface CryptoPredictionHubPoolSplitProps {
  left: PredictionOutcome;
  right: PredictionOutcome;
}

/** Sentiment bar and outcome pool shares (hub layout — no center status line). */
export function CryptoPredictionHubPoolSplit({ left, right }: CryptoPredictionHubPoolSplitProps) {
  const leftPercent = left.poolPercent ?? 0;
  const rightPercent = right.poolPercent ?? 0;
  const leftWidth = Math.min(100, Math.max(0, leftPercent));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-main-grayPurple/60 h-2 w-full overflow-hidden rounded-full">
        <div className="bg-main-success h-full rounded-full" style={{ width: `${leftWidth}%` }} />
      </div>

      <div className="flex items-center justify-between text-2xs tabular-nums">
        <span className="text-main-success font-semibold">{leftPercent}%</span>
        <span className="text-main-red font-semibold">{rightPercent}%</span>
      </div>
    </div>
  );
}
