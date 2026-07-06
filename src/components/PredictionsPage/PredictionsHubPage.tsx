"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { PredictionsHubItemsList } from "@/components/PredictionsPage/cards";
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
import { rydDataToRandomPool } from "@/shared/utils/rydMappers";
import { useEventsStore, type CPFPoolState } from "@/stores/eventsStore";
import { mapCPFPoolsToHubCards, resolveOffchainDataForPool } from "@/shared/utils/cpfPoolMapper";
import { useSourceConnection, useMarketsConnection } from "@/hooks/useLiveDataConnection";

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

  const { ryds, fetchAll: fetchAllRyd } = useRYDStore();
  useEffect(() => {
    void fetchAllRyd(address);
  }, [fetchAllRyd, address]);

  const { pools, offchainByContractId, fetchAllPoolStates } = useEventsStore();
  useEffect(() => {
    void fetchAllPoolStates();
  }, [fetchAllPoolStates]);

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

  const sectionTitle = useMemo(() => {
    const activeCategory = PREDICTIONS_HUB_CATEGORY_FILTERS.find(
      (category) => category.id === filters.categoryId
    );
    return activeCategory?.title;
  }, [filters.categoryId]);

  return (
    <div className="flex flex-col gap-6">
      <PredictionsHubFilter value={filters} onChange={setFilters} />
      {sectionTitle != null ? <SectionHeader>{sectionTitle}</SectionHeader> : null}
      <PredictionsHubItemsList items={items} />
    </div>
  );
}
