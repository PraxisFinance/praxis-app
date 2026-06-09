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
  const detail = event.politicsDetail;

  if (!detail) {
    return (
      <p className="text-main-darkPurple/60 text-sm">Detail data is not available for this market.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PoliticsEventDetailTitleCard thumbnailUrl={event.thumbnailUrl} title={event.title} />
      <PoliticsEventDetailProbabilityChart points={detail.chartPoints} />
      <PoliticsEventDetailOutcomes event={event} onPickOutcome={onPickOutcome} />
      <PoliticsEventDetailResolution paragraphs={detail.resolutionParagraphs} />
    </div>
  );
}
