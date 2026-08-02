"use client";

import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { ArrowIcon } from "@/components/ui";
import { buildPredictionsHubRoute, buildProgressHubRoute } from "@/lib/routes";
import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import type { ProgressHubCategoryId } from "@/shared/constants/progressHubFilters";
import { cn } from "@/lib/utils";

const menuCardVariants = cva(
  "relative flex w-full flex-col overflow-hidden rounded-[10px] bg-main-lightGray p-3 transition-transform active:scale-[0.98]",
  {
    variants: {
      size: {
        sm: "h-[148px]",
        lg: "h-[152px]",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const imageVariants = cva("pointer-events-none absolute z-0 object-contain", {
  variants: {
    size: {
      sm: "right-[-6%] bottom-[-8%] h-[118%] w-[90%]",
      lg: "right-[-4%] top-1/2 h-[130%] w-[58%] -translate-y-1/2",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface MenuCardV2Props extends VariantProps<typeof menuCardVariants> {
  title?: string;
  description?: string;
  backgroundImage?: string;
  redirectUrl?: string;
  redirectLabel?: string;
  hubCategoryId?: PredictionsHubCategoryId;
  progressHubCategoryId?: ProgressHubCategoryId;
}

function resolveMenuCardHref(
  redirectUrl: string | undefined,
  hubCategoryId: PredictionsHubCategoryId | undefined,
  progressHubCategoryId: ProgressHubCategoryId | undefined
): string {
  if (hubCategoryId != null) return buildPredictionsHubRoute(hubCategoryId);
  if (progressHubCategoryId != null) return buildProgressHubRoute(progressHubCategoryId);
  return redirectUrl ?? "";
}

export function MenuCardV2({
  title,
  description,
  backgroundImage,
  redirectUrl,
  redirectLabel,
  hubCategoryId,
  progressHubCategoryId,
  size = "sm",
}: MenuCardV2Props) {
  const href = resolveMenuCardHref(redirectUrl, hubCategoryId, progressHubCategoryId);

  return (
    <Link href={href} className={cn(menuCardVariants({ size }))}>
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title ?? redirectLabel ?? ""}
          width={512}
          height={512}
          className={cn(imageVariants({ size }))}
          priority={size === "lg"}
        />
      )}

      {(title || description) && (
        <div className="relative z-10 flex max-w-[55%] flex-col gap-1.5">
          {title && (
            <span className="text-main-darkPurple text-sm font-semibold leading-4">{title}</span>
          )}
          {description && (
            <span className="text-main-darkPurple/80 text-[10px] font-normal leading-3">
              {description}
            </span>
          )}
        </div>
      )}

      {redirectLabel && (
        <Badge variant="accent" className="relative z-10 mt-auto self-start text-2xs leading-3">
          {redirectLabel}
          <ArrowIcon className="h-4 w-4" />
        </Badge>
      )}
    </Link>
  );
}
