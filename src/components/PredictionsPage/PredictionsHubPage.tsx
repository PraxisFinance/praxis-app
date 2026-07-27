"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { PredictionsHubItemsList, TwoPoolHubCard } from "@/components/PredictionsPage/cards";
import { TwoPoolHubCardLink } from "@/components/PredictionsPage/cards/yield/TwoPoolHubCardLink";
import { PredictionsHubFilter } from "@/components/PredictionsPage/filters";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { filterPredictionsHubCards } from "@/shared/constants/predictionsHubCards";
import {
  applyPredictionsHubCategoryChange,
  createPredictionsHubFilterState,
  PREDICTIONS_HUB_CATEGORY_FILTERS,
  type PredictionsHubCategoryId,
  type PredictionsHubFilterState,
} from "@/shared/constants/predictionsHubFilters";
import { useRYDStore } from "@/stores/rydStore";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";
import { rydDataToRandomPool } from "@/shared/utils/rydMappers";
import { useEventsStore, type CPFPoolState } from "@/stores/eventsStore";
import { mapCPFPoolsToHubCards, resolveOffchainDataForPool } from "@/shared/utils/cpfPoolMapper";
import { useSourceConnection, useMarketsConnection } from "@/hooks/useLiveDataConnection";
import { usePredictionsHubTwoPoolDrawer } from "@/components/PredictionsPage/drawers";
import { PageSkeleton } from "@/components/ui/skeleton";

export interface PredictionsHubPageProps {
  /** Preset category filter when the page opens or when the prop changes. */
  initialCategoryId?: PredictionsHubCategoryId;
}

export function PredictionsHubPage({ initialCategoryId = "all" }: PredictionsHubPageProps) {
  const [filters, setFilters] = useState<PredictionsHubFilterState>(() =>
    createPredictionsHubFilterState(initialCategoryId)
  );

  useEffect(() => {
    setFilters((prev) => {
      if (prev.categoryId === initialCategoryId) return prev;
      return applyPredictionsHubCategoryChange(prev, initialCategoryId);
    });
  }, [initialCategoryId]);

  const { address } = useAccount();

  const { ryds, loading: rydLoading, fetchAll: fetchAllRyd } = useRYDStore();
  useEffect(() => {
    void fetchAllRyd(address);
  }, [fetchAllRyd, address]);

  const { pools, offchainByContractId, loading: eventsLoading, fetchAllPoolStates } = useEventsStore();
  useEffect(() => {
    void fetchAllPoolStates();
  }, [fetchAllPoolStates]);

  const { pools: twoPools, loading: twoPoolsLoading, fetchPools } = useTwoPoolsStore();
  useEffect(() => {
    void fetchPools();
  }, [fetchPools]);

  const poolStates = useMemo(
    () =>
      Object.values(pools)
        .map((p) => p.state)
        .filter((s): s is CPFPoolState => s !== null),
    [pools]
  );

  // ── Live data connections ──────────────────────────────────────────
  // Source socket broadcasts all sport / esports events immediately.
  useSourceConnection();

  // Collect conditionIds for finance pools so we can subscribe to oracle prices.
  const financeConditionIds = useMemo(() => {
    return poolStates
      .filter((pool) => resolveOffchainDataForPool(pool, offchainByContractId)?.category === "finance")
      .map((pool) => pool.conditionId)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
  }, [poolStates, offchainByContractId]);

  useMarketsConnection(financeConditionIds);

  const items = useMemo(() => {
    const eventCards = mapCPFPoolsToHubCards(poolStates, offchainByContractId);

    const rydCards = Object.values(ryds)
      .map(rydDataToRandomPool)
      .filter((c): c is NonNullable<ReturnType<typeof rydDataToRandomPool>> => c !== null);

    return filterPredictionsHubCards([...eventCards, ...rydCards], filters);
  }, [poolStates, offchainByContractId, ryds, filters]);

  const yieldPools = twoPools;

  const showYieldPools = filters.categoryId === "all" || filters.categoryId === "yield";
  const showHubItems = filters.categoryId !== "yield";
  const openTwoPoolDrawer = usePredictionsHubTwoPoolDrawer();

  const sectionTitle = useMemo(() => {
    const activeCategory = PREDICTIONS_HUB_CATEGORY_FILTERS.find(
      (category) => category.id === filters.categoryId
    );
    return activeCategory?.title;
  }, [filters.categoryId]);

  const isLoading = rydLoading || eventsLoading || twoPoolsLoading;
  const isEmpty =
    (showHubItems ? items.length === 0 : true) && (showYieldPools ? yieldPools.length === 0 : true);

  return (
    <div className="flex flex-col gap-6">
      <PredictionsHubFilter value={filters} onChange={setFilters} />
      {sectionTitle != null ? <SectionHeader>{sectionTitle}</SectionHeader> : null}
      {isLoading && isEmpty ? (
        <PageSkeleton variant="hub" rows={4} />
      ) : isEmpty ? (
        <p className="text-main-darkPurple/70 px-1 text-sm">No predictions found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {showYieldPools
            ? yieldPools.map((pool) => (
                <TwoPoolHubCardLink key={pool.id} pool={pool}>
                  <TwoPoolHubCard
                    pool={pool}
                    onPickSide={(side) => openTwoPoolDrawer(pool, side)}
                  />
                </TwoPoolHubCardLink>
              ))
            : null}
          {showHubItems && items.length > 0 ? <PredictionsHubItemsList items={items} /> : null}
        </div>
      )}
    </div>
  );
}
