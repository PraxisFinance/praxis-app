"use client";

import { Flame } from "lucide-react";
import { HintIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { TechEventHubPoolSplit } from "@/components/PredictionsPage/cards/tech/TechEventHubPoolSplit";
import type { TechHubEvent } from "@/shared/types/techHubEvent";

interface TechEventDetailOutcomesProps {
  event: TechHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function TechEventDetailOutcomes({ event, onPickOutcome }: TechEventDetailOutcomesProps) {
  const [yes, no] = event.outcomes;
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
        <div className="h-11 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full rounded-[8px] text-base text-white"
            onClick={() => onPickOutcome?.(yes.id)}
          >
            {yes.label}
          </Button>
        </div>
        <div className="h-11 min-w-0 flex-1">
          <Button
            type="button"
            variant="destructiveMuted"
            size="action"
            disabled={disabled}
            className="h-full rounded-[8px] text-base text-white"
            onClick={() => onPickOutcome?.(no.id)}
          >
            {no.label}
          </Button>
        </div>
      </div>

      <TechEventHubPoolSplit yes={yes} no={no} />
    </section>
  );
}
