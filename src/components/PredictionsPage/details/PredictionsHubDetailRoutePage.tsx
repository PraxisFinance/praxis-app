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
import { getTwoPoolDetailBreadcrumb } from "@/shared/utils/twoPoolFormat";
import { mapCPFPoolToHubCard, resolveOffchainDataForPool } from "@/shared/utils/cpfPoolMapper";
import { useEventsStore } from "@/stores/eventsStore";
import { useRYDStore } from "@/stores/rydStore";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";
import { rydDataToRandomPool } from "@/shared/utils/rydMappers";
import { PredictionsHubDetail } from "./PredictionsHubDetail";
import { PredictionsHubDetailPage } from "./PredictionsHubDetailPage";
import { TwoPoolHubDetail } from "./yield";
import { usePredictionsHubTwoPoolDrawer } from "@/components/PredictionsPage/drawers";
import { PageSkeleton } from "@/components/ui/skeleton";

export interface PredictionsHubDetailRoutePageProps {
  id: string;
}

export function PredictionsHubDetailRoutePage({ id }: PredictionsHubDetailRoutePageProps) {
  const { address } = useAccount();
  const { ryds, loading: rydLoading, fetchAll } = useRYDStore();
  const storeTwoPool = useTwoPoolsStore((state) => state.pools.find((pool) => pool.id === id));
  const fetchPools = useTwoPoolsStore((state) => state.fetchPools);
  const twoPoolsLoading = useTwoPoolsStore((state) => state.loading);
  const poolState = useEventsStore((state) => state.pools[id]?.state ?? null);
  const offchainByContractId = useEventsStore((state) => state.offchainByContractId);
  const eventsLoading = useEventsStore((state) => state.loading);
  const fetchAllPoolStates = useEventsStore((state) => state.fetchAllPoolStates);
  const [fetchInitiated, setFetchInitiated] = useState(false);

  const staticItem = findPredictionsHubItemById(id);
  const twoPool = storeTwoPool ?? null;
  const openTwoPoolDrawer = usePredictionsHubTwoPoolDrawer();

  const liveCpfItem = useMemo(() => {
    if (!poolState) return null;
    return mapCPFPoolToHubCard(
      poolState,
      resolveOffchainDataForPool(poolState, offchainByContractId),
    );
  }, [poolState, offchainByContractId]);

  useEffect(() => {
    if (staticItem) return;
    void Promise.all([fetchAll(address), fetchPools(), fetchAllPoolStates()]).then(() =>
      setFetchInitiated(true),
    );
  }, [staticItem, fetchAll, fetchPools, fetchAllPoolStates, address]);

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
    liveCpfItem ??
    (() => {
      const rydData = ryds[id];
      return rydData ? rydDataToRandomPool(rydData) : null;
    })();

  if (!item) {
    if (!fetchInitiated || rydLoading || twoPoolsLoading || eventsLoading) {
      return (
        <PredictionsHubDetailPage categoryId="all">
          <PageSkeleton variant="detail" />
        </PredictionsHubDetailPage>
      );
    }
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
