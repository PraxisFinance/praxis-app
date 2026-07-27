import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-main-grayPurple/70 animate-pulse rounded-lg", className)}
      {...props}
    />
  );
}

type PageSkeletonVariant = "cards" | "list" | "hub" | "detail";

interface PageSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual layout matching common page sections. */
  variant?: PageSkeletonVariant;
  /** Number of placeholder rows / cards. */
  rows?: number;
}

function PageSkeleton({
  variant = "cards",
  rows = 3,
  className,
  ...props
}: PageSkeletonProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-3", className)}
      aria-busy="true"
      aria-live="polite"
      {...props}
    >
      {variant === "cards" ? <CardsSkeleton rows={rows} /> : null}
      {variant === "list" ? <ListSkeleton rows={rows} /> : null}
      {variant === "hub" ? <HubSkeleton rows={rows} /> : null}
      {variant === "detail" ? <DetailSkeleton /> : null}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

function CardsSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="bg-main-lightGray flex w-full flex-col gap-4 rounded-[10px] p-4"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="bg-main-lightGray flex w-full flex-row items-center gap-3 rounded-lg px-3 py-3"
        >
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-4 w-14 shrink-0" />
        </div>
      ))}
    </>
  );
}

function HubSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      ))}
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-40 w-full rounded-[10px]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

function BalancesSkeleton() {
  return (
    <div className="flex flex-wrap gap-2.5" aria-busy="true" aria-live="polite">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="inline-flex flex-col items-start gap-[5px] rounded-[5px] bg-slate-200 px-2.5 py-[5px]"
        >
          <Skeleton className="h-3.5 w-10 rounded-sm bg-main-grayPurple/50" />
          <div className="inline-flex items-center gap-[5px]">
            <Skeleton className="size-4 rounded-full bg-main-grayPurple/50" />
            <Skeleton className="h-4 w-12 rounded-sm bg-main-grayPurple/50" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading balances…</span>
    </div>
  );
}

export { Skeleton, PageSkeleton, BalancesSkeleton };
export type { PageSkeletonVariant, PageSkeletonProps };
