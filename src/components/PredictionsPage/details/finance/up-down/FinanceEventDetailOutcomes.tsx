"use client";

import { Flame } from "lucide-react";
import { HintIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { CryptoPredictionUpDownDetailPoolSplit } from "@/components/PredictionsPage/details/crypto/up-down/CryptoPredictionUpDownDetailPoolSplit";
import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { formatEsportsOdds } from "@/shared/utils/esportsMatchFormat";

interface FinanceEventDetailOutcomesProps {
  event: FinanceHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function FinanceEventDetailOutcomes({
  event,
  onPickOutcome,
}: FinanceEventDetailOutcomesProps) {
  const [up, down] = event.outcomes;
  const disabled = !event.isTradingOpen;

  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center gap-1.5">
        <Flame className="text-main-purple size-4 shrink-0" aria-hidden />
        <h2 className="text-main-darkPurple text-sm font-medium">Outcomes</h2>
        <button
          type="button"
          className="text-main-darkPurple/45 hover:text-main-darkPurple/70 ml-0.5 inline-flex"
          aria-label="How outcomes work"
        >
          <HintIcon className="size-3.5" />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onPickOutcome?.(up.id)}
          >
            {up.label}
          </Button>
        </div>
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={() => onPickOutcome?.(down.id)}
          >
            {down.label}
          </Button>
        </div>
      </div>

      <CryptoPredictionUpDownDetailPoolSplit
        left={{ id: up.id, label: up.label, odds: up.odds ?? 0, poolPercent: up.poolPercent }}
        right={{ id: down.id, label: down.label, odds: down.odds ?? 0, poolPercent: down.poolPercent }}
      />
    </section>
  );
}
