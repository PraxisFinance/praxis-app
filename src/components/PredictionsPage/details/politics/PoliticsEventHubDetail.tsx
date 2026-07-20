"use client";

import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import { PoliticsEventDetailOutcomes } from "./PoliticsEventDetailOutcomes";
import { PoliticsEventDetailProbabilityChart } from "./PoliticsEventDetailProbabilityChart";
import { PoliticsEventDetailResolution } from "./PoliticsEventDetailResolution";
import { PoliticsEventDetailTitleCard } from "./PoliticsEventDetailTitleCard";

interface PoliticsEventHubDetailProps {
  event: PoliticsHubEvent;
  onPickOutcome?: (outcomeId: string) => void;
}

export function PoliticsEventHubDetail({ event, onPickOutcome }: PoliticsEventHubDetailProps) {
  const detail = event.detail;

  return (
    <div className="flex flex-col gap-4">
      <PoliticsEventDetailTitleCard thumbnailUrl={event.imageUrl} title={event.title} />
      {detail != null && <PoliticsEventDetailProbabilityChart points={detail.chartPoints} />}
      <PoliticsEventDetailOutcomes event={event} onPickOutcome={onPickOutcome} />
      {detail != null && (
        <PoliticsEventDetailResolution paragraphs={detail.resolutionParagraphs ?? []} />
      )}
    </div>
  );
}
