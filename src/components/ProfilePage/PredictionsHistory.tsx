"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PREDICTIONS_HISTORY_INTERVALS } from "@/shared/constants/profile";
import type { PredictionHistoryItem, PredictionsHistoryInterval } from "@/shared/types/profile";
import { useStatisticsStore } from "@/stores/statisticsStore";
import type { PredictionHistoryItem as StorePredItem } from "@/stores/statisticsStore";
import { PredictionsHistoryRow } from "./PredictionsHistoryRow";

export type { PredictionHistoryItem, PredictionsHistoryInterval };

const DAY_MS = 86_400_000;

const EMPTY_PRED_HISTORY: Record<PredictionsHistoryInterval, PredictionHistoryItem[]> = {
  "1D": [],
  "3D": [],
  "7D": [],
  "1M": [],
  "1Y": [],
};

export interface PredictionsHistoryProps {
  className?: string;
}

function buildPredHistoryData(
  items: StorePredItem[]
): Record<PredictionsHistoryInterval, PredictionHistoryItem[]> {
  const now = Date.now();
  if (!items.length) return EMPTY_PRED_HISTORY;

  const sorted = [...items].sort((a, b) => b.date - a.date);

  const ddmmyy = (ms: number) => {
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(2);
    return `${dd}/${mm}/${yy}`;
  };

  function slice(days: number, fmt: (ms: number) => string): PredictionHistoryItem[] {
    const cutoff = now - days * DAY_MS;
    return sorted
      .filter((i) => i.date >= cutoff)
      .map((i) => ({
        id: i.id,
        result: i.status,
        prediction: i.label,
        date: fmt(i.date),
        amount: Number(i.amount < 0n ? -i.amount : i.amount) / 1_000_000,
        currency: "$YT",
      }));
  }

  const shortMonthYear = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", { month: "short", year: "2-digit" });

  return {
    "1D": slice(1, ddmmyy),
    "3D": slice(3, ddmmyy),
    "7D": slice(7, ddmmyy),
    "1M": slice(30, ddmmyy),
    "1Y": slice(365, shortMonthYear),
  };
}

export function PredictionsHistory({ className }: PredictionsHistoryProps) {
  const [activeInterval, setActiveInterval] = useState<PredictionsHistoryInterval>("3D");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const predictionHistory = useStatisticsStore((s) => s.predictionHistory);

  const activeLabel =
    PREDICTIONS_HISTORY_INTERVALS.find((i) => i.id === activeInterval)?.label ?? "3 days";

  const data = useMemo(() => buildPredHistoryData(predictionHistory), [predictionHistory]);
  const items = data[activeInterval];

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
              <button
                type="button"
                aria-label="Close predictions history interval menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1.5 min-w-[100px] overflow-hidden rounded-sm bg-white shadow-[0_4px_20px_rgba(45,39,75,0.12)]">
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
                      activeInterval === interval.id ? "text-main-purple" : "text-main-darkPurple"
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
        <span className="flex-1 min-w-0 text-sm font-normal text-main tracking-wide">
          Prediction
        </span>
        <span className="w-20 text-sm font-normal text-main tracking-wide shrink-0">Date</span>
        <span className="w-24 text-sm font-normal text-main tracking-wide shrink-0 pl-[10px]">
          Amount
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2">
        {items.length > 0 ? (
          items.map((item) => <PredictionsHistoryRow key={item.id} item={item} />)
        ) : (
          <p className="text-main-darkPurple/50 py-6 text-center text-xs leading-5">
            No predictions in this period.
          </p>
        )}
      </div>
    </div>
  );
}
