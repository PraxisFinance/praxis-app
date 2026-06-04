"use client";

import {
  PREDICTIONS_HUB_KIND_TO_CATEGORY,
  type PredictionsHubItem,
} from "@/shared/types/predictionsHubItem";
import { PredictionsHubDetailPage } from "./PredictionsHubDetailPage";

export interface PredictionsHubDetailRoutePageProps {
  item: PredictionsHubItem;
}

export function PredictionsHubDetailRoutePage({ item }: PredictionsHubDetailRoutePageProps) {
  const categoryId = PREDICTIONS_HUB_KIND_TO_CATEGORY[item.kind];

  return <PredictionsHubDetailPage categoryId={categoryId} />;
}
