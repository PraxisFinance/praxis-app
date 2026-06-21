"use client";

import {
  PROGRESS_HUB_CATEGORY_FILTERS,
  type ProgressHubCategoryId,
} from "@/shared/constants/progressHubFilters";
import { FilterChipRow } from "@/components/PredictionsPage/filters/FilterChipRow";

export interface ProgressHubFilterProps {
  value: ProgressHubCategoryId;
  onChange: (value: ProgressHubCategoryId) => void;
}

export function ProgressHubFilter({ value, onChange }: ProgressHubFilterProps) {
  return (
    <FilterChipRow
      options={PROGRESS_HUB_CATEGORY_FILTERS}
      value={value}
      onChange={onChange}
      ariaLabel="Progress categories"
    />
  );
}
