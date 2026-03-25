"use client";

import type { CryptoBinaryOutcome } from "@/shared/types/cryptoPrediction";
import { Button } from "@/components/ui/button";

function PoolSplitAndStatsRow({
  left,
  right,
  statusLine,
}: {
  left: CryptoBinaryOutcome;
  right: CryptoBinaryOutcome;
  statusLine: { showLiveDot: boolean; text: string };
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-main-grayPurple/60">
        <div
          className="h-full bg-main-success"
          style={{ width: `${Math.min(100, Math.max(0, left.poolPercent))}%` }}
        />
        <div
          className="h-full bg-main-red"
          style={{ width: `${Math.min(100, Math.max(0, right.poolPercent))}%` }}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-x-2">
        <div className="min-w-0 shrink text-left text-2xs tabular-nums">
          <span className="text-main-darkPurple/65 font-medium">{left.label}</span>{" "}
          <span className="text-main-darkPurple font-semibold">{left.poolPercent}%</span>
        </div>

        <div className="flex min-w-0 shrink justify-center px-1">
          <div className="flex min-w-0 max-w-full items-start justify-center gap-1.5">
            {statusLine.showLiveDot && (
              <span
                className="bg-main-red mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                aria-hidden
              />
            )}
            <span className="text-main-darkPurple min-w-0 text-center text-2xs leading-snug font-medium break-words">
              {statusLine.text}
            </span>
          </div>
        </div>

        <div className="min-w-0 shrink text-right text-2xs tabular-nums">
          <span className="text-main-darkPurple/65 font-medium">{right.label}</span>{" "}
          <span className="text-main-darkPurple font-semibold">{right.poolPercent}%</span>
        </div>
      </div>
    </div>
  );
}

export interface CryptoPredictionBinaryOutcomesBlockProps {
  outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome];
  disabled: boolean;
  statusLine: { showLiveDot: boolean; text: string };
  onOutcomePick?: (outcomeId: string) => void;
}

export function CryptoPredictionBinaryOutcomesBlock({
  outcomes,
  disabled,
  statusLine,
  onOutcomePick,
}: CryptoPredictionBinaryOutcomesBlockProps) {
  const [first, second] = outcomes;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="h-12 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-main"
            onClick={() => onOutcomePick?.(first.id)}
          >
            {first.label}
          </Button>
        </div>
        <div className="h-12 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className="h-full text-main"
            onClick={() => onOutcomePick?.(second.id)}
          >
            {second.label}
          </Button>
        </div>
      </div>

      <PoolSplitAndStatsRow left={first} right={second} statusLine={statusLine} />
    </div>
  );
}
