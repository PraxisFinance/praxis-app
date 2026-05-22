"use client";

import { RequestFailedIcon } from "@/components/icons/shared/request-failed";
import { RequestSuccessIcon } from "@/components/icons/shared/request-success";
import { cn } from "@/lib/utils";

export type RequestResultStatus = "success" | "failed";

export interface RequestResultFormProps {
  title: string;
  /** Outcome type — selects success or failed icon. */
  status: RequestResultStatus;
  description: string;
  className?: string;
}

export function RequestResultForm({
  title,
  status,
  description,
  className,
}: RequestResultFormProps) {
  const Icon = status === "success" ? RequestSuccessIcon : RequestFailedIcon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex w-full flex-col items-center gap-4 text-center", className)}
    >
      <Icon className="h-[51px] w-[51px] shrink-0" aria-hidden />

      <div className="flex w-full flex-col items-center gap-1.5">
        <p className="text-main-darkPurple text-2xl font-normal leading-tight">{title}</p>
        <p className="text-main-darkPurple/70 text-sm font-normal leading-5">{description}</p>
      </div>
    </div>
  );
}
