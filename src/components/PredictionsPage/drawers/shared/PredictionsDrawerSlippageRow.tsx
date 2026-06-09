"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const SLIPPAGE_OPTIONS = ["1%", "3%", "5%"] as const;

export type PredictionsDrawerSlippage = (typeof SLIPPAGE_OPTIONS)[number];

interface PredictionsDrawerSlippageRowProps {
  value?: PredictionsDrawerSlippage;
  onChange?: (value: PredictionsDrawerSlippage) => void;
  disabled?: boolean;
}

export function PredictionsDrawerSlippageRow({
  value: controlledValue,
  onChange,
  disabled = false,
}: PredictionsDrawerSlippageRowProps) {
  const [internalValue, setInternalValue] = useState<PredictionsDrawerSlippage>("3%");
  const value = controlledValue ?? internalValue;

  const handleSelect = (next: PredictionsDrawerSlippage) => {
    if (disabled) return;
    setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-main-darkPurple/55 text-sm">Slippage</span>
      <div className="flex items-center gap-1.5">
        {SLIPPAGE_OPTIONS.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => handleSelect(option)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                selected
                  ? "bg-main-white text-main-darkPurple"
                  : "bg-main-grayPurple/80 text-main-darkPurple/70 hover:text-main-darkPurple",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
