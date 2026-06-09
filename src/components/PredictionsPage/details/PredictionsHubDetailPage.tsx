"use client";

import type { ReactNode } from "react";
import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import { PredictionsHubDetailHeader } from "./shared";

export interface PredictionsHubDetailPageProps {
  categoryId: PredictionsHubCategoryId;
  endsAt?: string;
  breadcrumb?: string;
  children?: ReactNode;
}

/** Shared shell for hub prediction detail screens. */
export function PredictionsHubDetailPage({
  categoryId,
  endsAt,
  breadcrumb,
  children,
}: PredictionsHubDetailPageProps) {
  return (
    <div className="flex min-h-full flex-col gap-4 pb-8">
      <PredictionsHubDetailHeader
        categoryId={categoryId}
        endsAt={endsAt}
        breadcrumb={breadcrumb}
      />
      {children}
    </div>
  );
}
