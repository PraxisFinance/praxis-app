"use client";

import { getPredictionsHubCategoryLabel } from "@/shared/constants/predictionsHubFilters";
import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import { PredictionsHubDetailCountdown } from "./PredictionsHubDetailCountdown";
import { PredictionsHubDetailNav } from "./PredictionsHubDetailNav";

export interface PredictionsHubDetailHeaderProps {
  categoryId: PredictionsHubCategoryId;
  endsAt?: string;
}

export function PredictionsHubDetailHeader({ categoryId, endsAt }: PredictionsHubDetailHeaderProps) {
  const categoryLabel = getPredictionsHubCategoryLabel(categoryId);

  return (
    <header className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <PredictionsHubDetailNav categoryId={categoryId} />
        {endsAt ? <PredictionsHubDetailCountdown endsAt={endsAt} /> : null}
      </div>
      <span className="text-main-darkPurple/55 text-2xs">{categoryLabel}</span>
    </header>
  );
}
