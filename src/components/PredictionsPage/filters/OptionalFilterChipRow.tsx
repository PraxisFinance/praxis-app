"use client";

import { FilterChipButton } from "./FilterChipButton";
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
          <FilterChipButton
            key={id}
            isActive={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : id)}
          >
            {label}
          </FilterChipButton>
        );
      })}
    </div>
  );
}
