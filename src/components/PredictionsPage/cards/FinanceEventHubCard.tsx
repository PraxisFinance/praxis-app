"use client";

import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import { getFinanceEventEndLine } from "@/shared/utils/financeHubEventFormat";
import { Button } from "@/components/ui/button";
import { stopHubCardLinkNavigation } from "./stopHubCardLinkNavigation";
import { FinanceEventHubCardHeader, FinanceEventHubPoolSplit } from "./finance";

interface FinanceEventHubCardProps {
  event: FinanceHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function FinanceEventHubCard({ event, onPickOutcome }: FinanceEventHubCardProps) {
  const [up, down] = event.outcomes;
  const disabled = !event.isTradingOpen;
  const endLine = getFinanceEventEndLine(event.endsAt);

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <FinanceEventHubCardHeader
        logoUrl={event.logoUrl}
        title={event.title}
        endLine={endLine}
        volumeLabel={event.volumeLabel}
      />

      <div className="flex gap-3">
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onPickOutcome?.(up.id);
            }}
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
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onPickOutcome?.(down.id);
            }}
          >
            {down.label}
          </Button>
        </div>
      </div>

      <FinanceEventHubPoolSplit up={up} down={down} />
    </article>
  );
}
