import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StatBadgeProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function StatBadge({ label, value, className }: StatBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-[6px] bg-main-grayPurple/55 px-1.5 py-1",
        className
      )}
    >
      <span className="text-main-darkPurple/65 text-2xs leading-tight">{label}:</span>
      <span className="text-main-darkPurple text-2xs leading-tight tabular-nums">{value}</span>
    </div>
  );
}
