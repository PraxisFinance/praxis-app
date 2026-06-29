"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildProgressHubRoute, PROGRESS_HUB_CATEGORY_QUERY } from "@/lib/routes";
import { resolveProgressHubCategoryId } from "@/shared/constants/progressHubFilters";
import type { ProgressHubCategoryId } from "@/shared/constants/progressHubFilters";
import { useProgressStore } from "@/stores/progress/store";

export function useProgressHubCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryId = useProgressStore((state) => state.activeCategoryId);
  const setActiveCategoryId = useProgressStore((state) => state.setActiveCategoryId);

  useEffect(() => {
    const categoryParam = searchParams.get(PROGRESS_HUB_CATEGORY_QUERY);
    const resolved = resolveProgressHubCategoryId(categoryParam ?? undefined);
    const current = useProgressStore.getState().activeCategoryId;

    if (resolved !== current) {
      setActiveCategoryId(resolved);
    }
  }, [searchParams, setActiveCategoryId]);

  const changeCategory = useCallback(
    (nextCategoryId: ProgressHubCategoryId) => {
      const current = useProgressStore.getState().activeCategoryId;
      if (nextCategoryId === current) return;

      setActiveCategoryId(nextCategoryId);
      router.replace(buildProgressHubRoute(nextCategoryId), { scroll: false });
    },
    [router, setActiveCategoryId],
  );

  return {
    activeCategoryId,
    changeCategory,
  };
}
