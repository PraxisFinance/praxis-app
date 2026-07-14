"use client";

import { OutcomesIcon } from "@/components/icons/feature/predictions/OutcomesIcon";
import { HintIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { InfoRow } from "@/components/ui/InfoRow";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  formatTwoPoolCurrentApy,
  formatTwoPoolPredictedApy,
} from "@/shared/utils/twoPoolFormat";

interface TwoPoolDetailOutcomesProps {
  pool: TwoPool;
  onPickSide?: (side: TwoPoolSide) => void;
}

export function TwoPoolDetailOutcomes({ pool, onPickSide }: TwoPoolDetailOutcomesProps) {
  const disabled = !pool.isTradingOpen;

  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center gap-1.5">
        <OutcomesIcon className="size-4 shrink-0" aria-hidden />
        <h2 className="text-main-darkPurple text-sm font-medium">Outcomes</h2>
        <button
          type="button"
          className="text-main-darkPurple/45 hover:text-main-darkPurple/70 ml-0.5 inline-flex"
          aria-label="How outcomes work"
        >
          <HintIcon className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <InfoRow label="Pool TVL:" value={pool.tvlLabel} />
        <InfoRow label="Current APY:" value={formatTwoPoolCurrentApy(pool)} />
        <InfoRow label="Predicted APY:" value={formatTwoPoolPredictedApy(pool)} />
      </div>

      <div className="flex gap-3">
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="primary"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onPickSide?.("stable")}
          >
            Stable
          </Button>
        </div>
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onPickSide?.("elevated")}
          >
            Elevated
          </Button>
        </div>
      </div>
    </section>
  );
}
