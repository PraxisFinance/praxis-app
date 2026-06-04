"use client";

import {
  getPredictionsHubItemEndsAt,
  PREDICTIONS_HUB_KIND_TO_CATEGORY,
  type PredictionsHubItem,
} from "@/shared/types/predictionsHubItem";
import { PredictionsHubDetail } from "./PredictionsHubDetail";
import { PredictionsHubDetailPage } from "./PredictionsHubDetailPage";

export interface PredictionsHubDetailRoutePageProps {
  item: PredictionsHubItem;
}

export function PredictionsHubDetailRoutePage({ item }: PredictionsHubDetailRoutePageProps) {
  const categoryId = PREDICTIONS_HUB_KIND_TO_CATEGORY[item.kind];

  return (
    <PredictionsHubDetailPage categoryId={categoryId} endsAt={getPredictionsHubItemEndsAt(item)}>
      <PredictionsHubDetail item={item} />
    </PredictionsHubDetailPage>
  );
}
