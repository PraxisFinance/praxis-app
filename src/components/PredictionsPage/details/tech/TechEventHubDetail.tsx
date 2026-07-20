"use client";

import type { TechHubEvent } from "@/shared/types/techHubEvent";
import { TechEventDetailOutcomes } from "./TechEventDetailOutcomes";
import { TechEventDetailProbabilityChart } from "./TechEventDetailProbabilityChart";
import { TechEventDetailResolution } from "./TechEventDetailResolution";
import { TechEventDetailTitleCard } from "./TechEventDetailTitleCard";

interface TechEventHubDetailProps {
  event: TechHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function TechEventHubDetail({ event, onPickOutcome }: TechEventHubDetailProps) {
  const detail = event.detail;

  return (
    <div className="flex flex-col gap-4">
      <TechEventDetailTitleCard thumbnailUrl={event.imageUrl} title={event.title} />
      {detail != null && <TechEventDetailProbabilityChart points={detail.chartPoints} />}
      <TechEventDetailOutcomes event={event} onPickOutcome={onPickOutcome} />
      {detail != null && (
        <TechEventDetailResolution paragraphs={detail.resolutionParagraphs ?? []} />
      )}
    </div>
  );
}
