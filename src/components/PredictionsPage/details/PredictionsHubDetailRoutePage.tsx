"use client";

import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  getPredictionsHubDetailBreadcrumb,
  getPredictionsHubItemEndsAt,
  getPredictionsHubItemKind,
  PREDICTIONS_HUB_KIND_TO_CATEGORY,
} from "@/shared/types/predictionsHubItem";
import { findPredictionsHubItemById } from "@/shared/constants/predictionsHubCards";
import {
  findTwoPoolHubMockById,
  getTwoPoolDetailBreadcrumb,
} from "@/shared/constants/twoPoolHubMocks";
import { useRYDStore } from "@/stores/rydStore";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";
import { rydDataToRandomPool } from "@/shared/utils/rydMappers";
import { PredictionsHubDetail } from "./PredictionsHubDetail";
import { PredictionsHubDetailPage } from "./PredictionsHubDetailPage";
import { TwoPoolHubDetail } from "./yield";
import { usePredictionsHubTwoPoolDrawer } from "@/components/PredictionsPage/drawers";

export interface PredictionsHubDetailRoutePageProps {
  id: string;
}

export function PredictionsHubDetailRoutePage({ id }: PredictionsHubDetailRoutePageProps) {
  const { address } = useAccount();
  const { ryds, loading: rydLoading, fetchAll } = useRYDStore();
  const storeTwoPool = useTwoPoolsStore((state) => state.pools.find((pool) => pool.id === id));
  const fetchPools = useTwoPoolsStore((state) => state.fetchPools);
  const twoPoolsLoading = useTwoPoolsStore((state) => state.loading);
  const [fetchInitiated, setFetchInitiated] = useState(false);

  const staticItem = findPredictionsHubItemById(id);
  const mockTwoPool = useMemo(() => findTwoPoolHubMockById(id), [id]);
  const twoPool = storeTwoPool ?? mockTwoPool ?? null;
  const openTwoPoolDrawer = usePredictionsHubTwoPoolDrawer();

  useEffect(() => {
    if (staticItem || mockTwoPool) return;
    void Promise.all([fetchAll(address), fetchPools()]).then(() => setFetchInitiated(true));
  }, [staticItem, mockTwoPool, fetchAll, fetchPools, address]);

  if (twoPool) {
    return (
      <PredictionsHubDetailPage
        categoryId="yield"
        endsAt={twoPool.endsAt}
        breadcrumb={getTwoPoolDetailBreadcrumb()}
      >
        <TwoPoolHubDetail
          pool={twoPool}
          onPickSide={(side) => openTwoPoolDrawer(twoPool, side)}
        />
      </PredictionsHubDetailPage>
    );
  }

  const item =
    staticItem ??
    (() => {
      const rydData = ryds[id];
      return rydData ? rydDataToRandomPool(rydData) : null;
    })();

  if (!item) {
    if (!fetchInitiated || rydLoading || twoPoolsLoading) return null;
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
