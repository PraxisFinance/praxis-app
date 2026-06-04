"use client";

import type { ReactNode } from "react";
import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import { PredictionsHubDetailNav } from "./PredictionsHubDetailNav";

export interface PredictionsHubDetailPageProps {
  categoryId: PredictionsHubCategoryId;
  children?: ReactNode;
}

/** Shared shell for hub prediction detail screens (nav only until content is added). */
export function PredictionsHubDetailPage({ categoryId, children }: PredictionsHubDetailPageProps) {
  return (
    <div className="flex min-h-full flex-col gap-5 pb-8">
      <PredictionsHubDetailNav categoryId={categoryId} />
      {children}
    </div>
  );
}
