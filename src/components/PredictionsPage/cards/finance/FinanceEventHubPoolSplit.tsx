"use client";

import type { FinanceHubBinaryOutcome } from "@/shared/types/financeHubEvent";
import { formatFinancePoolPercent } from "@/shared/utils/financeHubEventFormat";

interface FinanceEventHubPoolSplitProps {
  up: FinanceHubBinaryOutcome;
  down: FinanceHubBinaryOutcome;
}

/** Sentiment bar — Up share in green (finance hub mock, same as crypto Up/Down). */
export function FinanceEventHubPoolSplit({ up, down }: FinanceEventHubPoolSplitProps) {
  const upWidth = Math.min(100, Math.max(0, up.poolPercent ?? 0));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-main-grayPurple/60 h-2 w-full overflow-hidden rounded-full">
        <div className="bg-main-success h-full rounded-full" style={{ width: `${upWidth}%` }} />
      </div>

      <div className="flex items-center justify-between text-2xs tabular-nums">
        <span className="text-main-success font-semibold">{formatFinancePoolPercent(up.poolPercent ?? 0)}</span>
        <span className="text-main-red font-semibold">{formatFinancePoolPercent(down.poolPercent ?? 0)}</span>
      </div>
    </div>
  );
}
