"use client";

import { cn } from "@/lib/utils";

export interface FilterChipOption<T extends string> {
  id: T;
  label: string;
}

interface FilterChipRowProps<T extends string> {
  options: readonly FilterChipOption<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}

export function FilterChipRow<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: FilterChipRowProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={ariaLabel}>
      {options.map(({ id, label }) => {
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
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
