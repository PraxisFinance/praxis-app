"use client";

import { cn } from "@/lib/utils";
import type { FilterChipOption } from "./FilterChipRow";

interface OptionalFilterChipRowProps<T extends string> {
  options: readonly FilterChipOption<T>[];
  value: T | null;
  onChange: (id: T | null) => void;
  ariaLabel: string;
}

export function OptionalFilterChipRow<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: OptionalFilterChipRowProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map(({ id, label }) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : id)}
            className={cn(
              "px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all",
              isActive
                ? "bg-main-purple text-white"
                : "bg-main-lightGray text-main-darkPurple hover:bg-main-grayPurple",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
