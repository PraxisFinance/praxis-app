"use client";

import { FilterChipButton } from "./FilterChipButton";

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
          <FilterChipButton
            key={id}
            isActive={isActive}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
          >
            {label}
          </FilterChipButton>
        );
      })}
    </div>
  );
}
