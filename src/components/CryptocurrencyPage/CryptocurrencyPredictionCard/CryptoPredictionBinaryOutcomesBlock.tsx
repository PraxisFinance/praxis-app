"use client";

import type { CryptoBinaryOutcome } from "@/shared/types/cryptoPrediction";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";
import { cn } from "@/lib/utils";

function PoolSplitBar({ left, right }: { left: CryptoBinaryOutcome; right: CryptoBinaryOutcome }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-main-grayPurple/60">
        <div
          className="h-full bg-main-success"
          style={{ width: `${Math.min(100, Math.max(0, left.poolPercent))}%` }}
        />
        <div
          className="h-full bg-main-red"
          style={{ width: `${Math.min(100, Math.max(0, right.poolPercent))}%` }}
        />
      </div>
      <div className="text-main-darkPurple flex justify-between text-2xs font-medium tabular-nums">
        <span>
          {left.label} {left.poolPercent}%
        </span>
        <span>
          {right.label} {right.poolPercent}%
        </span>
      </div>
    </div>
  );
}

function BinaryOutcomeButton({
  variant,
  label,
  odds,
  disabled,
}: {
  variant: "positive" | "negative";
  label: string;
  odds: number;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2.5 outline-none transition-opacity",
        variant === "positive"
          ? "bg-main-lightGreen text-main-darkGreen"
          : "bg-main-red/15 text-main-red",
        disabled ? "pointer-events-none opacity-45" : "hover:opacity-95 active:opacity-90"
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs font-semibold tabular-nums">{formatEsportsOdds(odds)}</span>
    </button>
  );
}

export interface CryptoPredictionBinaryOutcomesBlockProps {
  outcomes: [CryptoBinaryOutcome, CryptoBinaryOutcome];
  disabled: boolean;
}

export function CryptoPredictionBinaryOutcomesBlock({
  outcomes,
  disabled,
}: CryptoPredictionBinaryOutcomesBlockProps) {
  const [first, second] = outcomes;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <BinaryOutcomeButton variant="positive" label={first.label} odds={first.odds} disabled={disabled} />
        <BinaryOutcomeButton variant="negative" label={second.label} odds={second.odds} disabled={disabled} />
      </div>
      <PoolSplitBar left={first} right={second} />
    </div>
  );
}
