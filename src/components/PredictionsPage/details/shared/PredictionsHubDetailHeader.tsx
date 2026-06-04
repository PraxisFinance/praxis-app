"use client";

import { getPredictionsHubCategoryLabel } from "@/shared/constants/predictionsHubFilters";
import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import { PredictionsHubDetailCountdown } from "./PredictionsHubDetailCountdown";
import { PredictionsHubDetailNav } from "./PredictionsHubDetailNav";

export interface PredictionsHubDetailHeaderProps {
  categoryId: PredictionsHubCategoryId;
  endsAt?: string;
  /** When set, shown instead of the category label (e.g. «Esports • Dota 2»). */
  breadcrumb?: string;
}

export function PredictionsHubDetailHeader({
  categoryId,
  endsAt,
  breadcrumb,
}: PredictionsHubDetailHeaderProps) {
  const subheading = breadcrumb ?? getPredictionsHubCategoryLabel(categoryId);

  return (
    <header className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <PredictionsHubDetailNav categoryId={categoryId} />
        {endsAt ? <PredictionsHubDetailCountdown endsAt={endsAt} /> : null}
      </div>
      <span className="text-main-darkPurple/55 text-2xs">{subheading}</span>
    </header>
  );
}
