"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterDropdownOption<T extends string = string> {
  id: T;
  label: string;
}

interface FilterDropdownProps<T extends string = string> {
  options: FilterDropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  minWidth?: string;
  className?: string;
}

export function FilterDropdown<T extends string>({
  options,
  value,
  onChange,
  minWidth = "100px",
  className,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const activeLabel = options.find((o) => o.id === value)?.label ?? options[0]?.label;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-sm bg-main-lightGray px-3 py-1.5 text-xs font-medium text-main-darkPurple transition-colors hover:bg-main-grayPurple"
      >
        {activeLabel}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 z-20 mt-1.5 overflow-hidden rounded-sm bg-white shadow-[0_4px_20px_rgba(45,39,75,0.12)]"
            style={{ minWidth }}
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-main-lightGray",
                  value === option.id ? "text-main-purple" : "text-main-darkPurple"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
