"use client";

import { cn } from "@/lib/utils";

interface EsportsMatchHubScoreBoxProps {
  value: number | undefined;
}

export function EsportsMatchHubScoreBox({ value }: EsportsMatchHubScoreBoxProps) {
  return (
    <span
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-semibold",
        value === undefined
          ? "bg-main-grayPurple/80 text-main-darkPurple/50"
          : "bg-main-grayPurple text-main-darkPurple",
      )}
    >
      {value ?? "—"}
    </span>
  );
}
