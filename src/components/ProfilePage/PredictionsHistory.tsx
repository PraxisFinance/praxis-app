"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  PREDICTIONS_HISTORY_INTERVALS,
  PREDICTIONS_HISTORY_MOCK_DATA,
} from "@/shared/constants/profile";
import type {
  PredictionHistoryItem,
  PredictionsHistoryInterval,
} from "@/shared/types/profile";
import { PredictionsHistoryRow } from "./PredictionsHistoryRow";

export type { PredictionHistoryItem, PredictionsHistoryInterval };

export interface PredictionsHistoryProps {
  data?: Partial<Record<PredictionsHistoryInterval, PredictionHistoryItem[]>>;
  className?: string;
}

export function PredictionsHistory({ data, className }: PredictionsHistoryProps) {
  const [activeInterval, setActiveInterval] = useState<PredictionsHistoryInterval>("3D");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLabel =
    PREDICTIONS_HISTORY_INTERVALS.find((i) => i.id === activeInterval)?.label ?? "3 days";

  const items = data?.[activeInterval] ?? PREDICTIONS_HISTORY_MOCK_DATA[activeInterval];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionHeader>Predictions history</SectionHeader>

        {/* Interval selector */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-sm bg-main-lightGray px-3 py-1.5 text-xs font-medium text-main-darkPurple transition-colors hover:bg-main-grayPurple"
          >
            {activeLabel}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 z-20 mt-1.5 min-w-[100px] overflow-hidden rounded-[8px] bg-white shadow-[0_4px_20px_rgba(45,39,75,0.12)]">
                {PREDICTIONS_HISTORY_INTERVALS.map((interval) => (
                  <button
                    key={interval.id}
                    type="button"
                    onClick={() => {
                      setActiveInterval(interval.id);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-main-lightGray",
                      activeInterval === interval.id
                        ? "text-main-purple"
                        : "text-main-darkPurple"
                    )}
                  >
                    {interval.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Column headers */}
      {/* Column headers */}
      <div className="flex items-center gap-4 px-2">
        <span className="w-8 shrink-0 text-sm font-normal text-main tracking-wide">Result</span>
        <span className="flex-1 min-w-0 text-sm font-normal text-main tracking-wide">Prediction</span>
        <span className="w-20 text-sm font-normal text-main tracking-wide shrink-0">Date</span>
        <span className="w-24 text-sm font-normal text-main tracking-wide shrink-0 pl-[10px]">Amount</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <PredictionsHistoryRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
