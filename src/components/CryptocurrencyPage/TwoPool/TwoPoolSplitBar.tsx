"use client";

import { cn } from "@/lib/utils";

export interface TwoPoolSplitBarProps {
  stableLabel?: string;
  elevatedLabel?: string;
  stablePoolPercent: number;
  elevatedPoolPercent: number;
  statusLine: { showLiveDot: boolean; text: string };
  className?: string;
}

export function TwoPoolSplitBar({
  stableLabel = "Stable",
  elevatedLabel = "Elevated",
  stablePoolPercent,
  elevatedPoolPercent,
  statusLine,
  className,
}: TwoPoolSplitBarProps) {
  const left = Math.min(100, Math.max(0, stablePoolPercent));
  const right = Math.min(100, Math.max(0, elevatedPoolPercent));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-main-grayPurple/60">
        <div className="h-full bg-main-success" style={{ width: `${left}%` }} />
        <div className="h-full bg-main-red" style={{ width: `${right}%` }} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-x-2">
        <div className="min-w-0 shrink text-left text-2xs tabular-nums">
          <span className="text-main-darkPurple/65 font-medium">{stableLabel}</span>{" "}
          <span className="text-main-darkPurple font-semibold">{left}%</span>
        </div>

        <div className="flex min-w-0 shrink justify-center px-1">
          <div className="flex min-w-0 max-w-full items-start justify-center gap-1.5">
            {statusLine.showLiveDot && (
              <span className="bg-main-red mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden />
            )}
            <span className="text-main-darkPurple min-w-0 text-center text-2xs leading-snug font-medium break-words">
              {statusLine.text}
            </span>
          </div>
        </div>

        <div className="min-w-0 shrink text-right text-2xs tabular-nums">
          <span className="text-main-darkPurple/65 font-medium">{elevatedLabel}</span>{" "}
          <span className="text-main-darkPurple font-semibold">{right}%</span>
        </div>
      </div>
    </div>
  );
}
