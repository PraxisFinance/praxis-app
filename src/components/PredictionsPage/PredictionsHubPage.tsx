"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { PredictionsHubItemsList } from "@/components/PredictionsPage/cards";
import { PredictionsHubFilter } from "@/components/PredictionsPage/filters";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  filterPredictionsHubCardMocks,
  PREDICTIONS_HUB_CARD_MOCKS,
} from "@/shared/constants/predictionsHubCards";
import {
  applyPredictionsHubCategoryChange,
  createPredictionsHubFilterState,
  PREDICTIONS_HUB_CATEGORY_FILTERS,
  type PredictionsHubCategoryId,
  type PredictionsHubFilterState,
} from "@/shared/constants/predictionsHubFilters";
import { useRYDStore } from "@/stores/rydStore";
import { rydDataToRandomPool } from "@/shared/utils/rydMappers";
import type { PredictionsHubListItem } from "@/shared/types/predictions";

export interface PredictionsHubPageProps {
  /** Preset category filter when the page opens or when the prop changes. */
  initialCategoryId?: PredictionsHubCategoryId;
}

const NON_RYD_MOCKS: PredictionsHubListItem[] = PREDICTIONS_HUB_CARD_MOCKS.filter(
  (item) => item.predictionType !== "random_reward",
);

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
  const { ryds, fetchAll } = useRYDStore();

  useEffect(() => {
    void fetchAll(address);
  }, [fetchAll, address]);

  const items = useMemo(() => {
    const rydCards = Object.values(ryds)
      .map(rydDataToRandomPool)
      .filter((c): c is NonNullable<ReturnType<typeof rydDataToRandomPool>> => c !== null);

    return filterPredictionsHubCardMocks([...NON_RYD_MOCKS, ...rydCards], filters);
  }, [ryds, filters]);

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
