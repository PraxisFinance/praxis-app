"use client";

import type { TechHubBinaryOutcome } from "@/shared/types/techHubEvent";
import { formatTechPoolPercent } from "@/shared/utils/techHubEventFormat";

interface TechEventHubPoolSplitProps {
  yes: TechHubBinaryOutcome;
  no: TechHubBinaryOutcome;
}

/** Sentiment bar — Yes share in red (same layout as politics hub cards). */
export function TechEventHubPoolSplit({ yes, no }: TechEventHubPoolSplitProps) {
  const yesWidth = Math.min(100, Math.max(0, yes.poolPercent ?? 0));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="bg-main-grayPurple/60 h-2 w-full overflow-hidden rounded-full">
        <div className="bg-main-red h-full rounded-full" style={{ width: `${yesWidth}%` }} />
      </div>

      <div className="flex items-center justify-between text-2xs tabular-nums">
        <span className="text-main-red font-semibold">{formatTechPoolPercent(yes.poolPercent ?? 0)}</span>
        <span className="text-main-darkPurple font-semibold">{formatTechPoolPercent(no.poolPercent ?? 0)}</span>
      </div>
    </div>
  );
}
