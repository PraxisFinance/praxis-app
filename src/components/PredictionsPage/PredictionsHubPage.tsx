"use client";

import { useMemo, useState } from "react";
import { PredictionsHubItemsList } from "@/components/PredictionsPage/cards";
import { PredictionsHubFilter } from "@/components/PredictionsPage/filter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  DEFAULT_PREDICTIONS_HUB_FILTER_STATE,
  PREDICTIONS_HUB_CATEGORY_FILTERS,
  type PredictionsHubFilterState,
} from "@/shared/constants/predictionsHubFilters";
import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";

export function PredictionsHubPage() {
  const [filters, setFilters] = useState<PredictionsHubFilterState>(
    DEFAULT_PREDICTIONS_HUB_FILTER_STATE,
  );

  /** Feed items for the active filters — populated when data layer is wired. */
  const items: PredictionsHubItem[] = [];

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
