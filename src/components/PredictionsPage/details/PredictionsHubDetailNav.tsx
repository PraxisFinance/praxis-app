"use client";

import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { buildPredictionsHubRoute } from "@/lib/routes";
import { getPredictionsHubCategoryLabel } from "@/shared/constants/predictionsHubFilters";
import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";

const hubFilterChipClassName = "px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all";

export interface PredictionsHubDetailNavProps {
  categoryId: PredictionsHubCategoryId;
}

export function PredictionsHubDetailNav({ categoryId }: PredictionsHubDetailNavProps) {
  const router = useRouter();
  const categoryLabel = getPredictionsHubCategoryLabel(categoryId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => router.back()}
        className={cn(
          hubFilterChipClassName,
          "bg-main-purple text-white hover:bg-main-purple/90 inline-flex items-center gap-1"
        )}
      >
        <ArrowIcon className="h-3.5 w-3.5 shrink-0 rotate-180" aria-hidden />
        Back
      </button>

      <button
        type="button"
        onClick={() => router.push(buildPredictionsHubRoute(categoryId))}
        className={cn(
          hubFilterChipClassName,
          "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple"
        )}
      >
        {categoryLabel}
      </button>
    </div>
  );
}
