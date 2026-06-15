"use client";

import type { PoliticsHubBinaryOutcome } from "@/shared/types/politicsHubEvent";
import { formatPoliticsPoolPercent } from "@/shared/utils/politicsHubEventFormat";

interface PoliticsEventHubPoolSplitProps {
  yes: PoliticsHubBinaryOutcome;
  no: PoliticsHubBinaryOutcome;
}

/** Sentiment bar — Yes share in red (per politics hub mock). */
export function PoliticsEventHubPoolSplit({ yes, no }: PoliticsEventHubPoolSplitProps) {
  const yesWidth = Math.min(100, Math.max(0, yes.poolPercent ?? 0));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-main-grayPurple/60 h-2 w-full overflow-hidden rounded-full">
        <div className="bg-main-red h-full rounded-full" style={{ width: `${yesWidth}%` }} />
      </div>

      <div className="flex items-center justify-between text-2xs tabular-nums">
        <span className="text-main-red font-semibold">{formatPoliticsPoolPercent(yes.poolPercent ?? 0)}</span>
        <span className="text-main-darkPurple font-semibold">
          {formatPoliticsPoolPercent(no.poolPercent ?? 0)}
        </span>
      </div>
    </div>
  );
}
