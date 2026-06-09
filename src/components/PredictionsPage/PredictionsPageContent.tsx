"use client";

import { useSearchParams } from "next/navigation";
import { PredictionsHubPage } from "@/components/PredictionsPage/PredictionsHubPage";
import { isPredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import { PREDICTIONS_HUB_CATEGORY_QUERY } from "@/lib/routes";

export function PredictionsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get(PREDICTIONS_HUB_CATEGORY_QUERY);
  const initialCategoryId =
    categoryParam != null && isPredictionsHubCategoryId(categoryParam) ? categoryParam : "all";

  return <PredictionsHubPage initialCategoryId={initialCategoryId} />;
}
