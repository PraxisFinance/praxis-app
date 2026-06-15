"use client";

import type { TechHubEvent } from "@/shared/types/techHubEvent";
import { getTechEventEndLine } from "@/shared/utils/techHubEventFormat";
import { Button } from "@/components/ui/button";
import { stopHubCardLinkNavigation } from "./stopHubCardLinkNavigation";
import { TechEventHubCardHeader, TechEventHubPoolSplit } from "./tech";

interface TechEventHubCardProps {
  event: TechHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function TechEventHubCard({ event, onPickOutcome }: TechEventHubCardProps) {
  const [yes, no] = event.outcomes;
  const disabled = !event.isTradingOpen;
  const endLine = getTechEventEndLine(event.endsAt ?? "");

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <TechEventHubCardHeader
        thumbnailUrl={event.imageUrl}
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
              onPickOutcome?.(yes.id);
            }}
          >
            {yes.label}
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
              onPickOutcome?.(no.id);
            }}
          >
            {no.label}
          </Button>
        </div>
      </div>

      <TechEventHubPoolSplit yes={yes} no={no} />
    </article>
  );
}
