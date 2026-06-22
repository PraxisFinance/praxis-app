"use client";

import { useSearchParams } from "next/navigation";
import { ProgressHubPage } from "@/components/ProgressPage/ProgressHubPage";
import {
  resolveProgressHubCategoryId,
} from "@/shared/constants/progressHubFilters";
import { PROGRESS_HUB_CATEGORY_QUERY } from "@/lib/routes";

export function ProgressPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get(PROGRESS_HUB_CATEGORY_QUERY);
  const initialCategoryId = resolveProgressHubCategoryId(categoryParam);

  return <ProgressHubPage initialCategoryId={initialCategoryId} />;
}
