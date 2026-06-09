"use client";

import { useEffect, useMemo, useState } from "react";
import { PredictionsHubItemsList } from "@/components/PredictionsPage/cards";
import { PredictionsHubFilter } from "@/components/PredictionsPage/filter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPredictionsHubCardMocks } from "@/shared/constants/predictionsHubCards";
import {
  applyPredictionsHubCategoryChange,
  createPredictionsHubFilterState,
  PREDICTIONS_HUB_CATEGORY_FILTERS,
  type PredictionsHubCategoryId,
  type PredictionsHubFilterState,
} from "@/shared/constants/predictionsHubFilters";

export interface PredictionsHubPageProps {
  /** Preset category filter when the page opens or when the prop changes. */
  initialCategoryId?: PredictionsHubCategoryId;
}

export function PredictionsHubPage({
  initialCategoryId = "all",
}: PredictionsHubPageProps) {
  const [filters, setFilters] = useState<PredictionsHubFilterState>(() =>
    createPredictionsHubFilterState(initialCategoryId),
  );

  useEffect(() => {
    setFilters((prev) => {
      if (prev.categoryId === initialCategoryId) return prev;
      return applyPredictionsHubCategoryChange(prev, initialCategoryId);
    });
  }, [initialCategoryId]);

  const items = useMemo(() => getPredictionsHubCardMocks(filters), [filters]);

  const sectionTitle = useMemo(() => {
    const activeCategory = PREDICTIONS_HUB_CATEGORY_FILTERS.find(
      (category) => category.id === filters.categoryId,
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
