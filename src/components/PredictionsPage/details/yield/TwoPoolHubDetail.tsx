"use client";

import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import { TwoPoolDetailOutcomes } from "./TwoPoolDetailOutcomes";
import { TwoPoolDetailPerformanceChart } from "./TwoPoolDetailPerformanceChart";
import { TwoPoolDetailResolution } from "./TwoPoolDetailResolution";
import { TwoPoolDetailTitleCard } from "./TwoPoolDetailTitleCard";

interface TwoPoolHubDetailProps {
  pool: TwoPool;
  onPickSide?: (side: TwoPoolSide) => void;
}

export function TwoPoolHubDetail({ pool, onPickSide }: TwoPoolHubDetailProps) {
  const detail = pool.detail;

  if (!detail) {
    return (
      <div className="flex flex-col gap-4">
        <TwoPoolDetailTitleCard title={pool.title} />
        <TwoPoolDetailOutcomes pool={pool} onPickSide={onPickSide} />
        <p className="text-main-darkPurple/60 text-sm">
          Detail data is not available for this pool yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TwoPoolDetailTitleCard title={pool.title} />
      <TwoPoolDetailPerformanceChart points={detail.chartPoints} />
      <TwoPoolDetailOutcomes pool={pool} onPickSide={onPickSide} />
      <TwoPoolDetailResolution paragraphs={detail.resolutionParagraphs} />
    </div>
  );
}
