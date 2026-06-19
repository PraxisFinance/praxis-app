"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  getPredictionsHubDetailBreadcrumb,
  getPredictionsHubItemEndsAt,
  getPredictionsHubItemKind,
  PREDICTIONS_HUB_KIND_TO_CATEGORY,
} from "@/shared/types/predictionsHubItem";
import { findPredictionsHubItemById } from "@/shared/constants/predictionsHubCards";
import { useRYDStore } from "@/stores/rydStore";
import { rydDataToRandomPool } from "@/shared/utils/rydMappers";
import { PredictionsHubDetail } from "./PredictionsHubDetail";
import { PredictionsHubDetailPage } from "./PredictionsHubDetailPage";

export interface PredictionsHubDetailRoutePageProps {
  id: string;
}

export function PredictionsHubDetailRoutePage({ id }: PredictionsHubDetailRoutePageProps) {
  const { address } = useAccount();
  const { ryds, loading, fetchAll } = useRYDStore();
  const [fetchInitiated, setFetchInitiated] = useState(false);

  const staticItem = findPredictionsHubItemById(id);

  useEffect(() => {
    if (staticItem) return;
    void fetchAll(address).then(() => setFetchInitiated(true));
  }, [staticItem, fetchAll, address]);

  const item = staticItem ?? (() => {
    const rydData = ryds[id];
    return rydData ? rydDataToRandomPool(rydData) : null;
  })();

  if (!item) {
    if (!fetchInitiated || loading) return null;
    notFound();
  }

  const categoryId = PREDICTIONS_HUB_KIND_TO_CATEGORY[getPredictionsHubItemKind(item)];

  return (
    <PredictionsHubDetailPage
      categoryId={categoryId}
      endsAt={getPredictionsHubItemEndsAt(item)}
      breadcrumb={getPredictionsHubDetailBreadcrumb(item)}
    >
      <PredictionsHubDetail item={item} />
    </PredictionsHubDetailPage>
  );
}
