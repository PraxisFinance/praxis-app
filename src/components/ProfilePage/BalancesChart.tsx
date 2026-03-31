"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  BALANCES_CHART_INTERVALS,
  BALANCE_CURRENCY_META,
  BALANCES_CHART_MOCK_DATA,
} from "@/shared/constants/balances";
import type {
  BalanceCurrencyKey,
  BalancesChartDataPoint,
  BalancesChartInterval,
} from "@/shared/types/balances";

export type { BalancesChartDataPoint, BalancesChartInterval };

export interface BalancesChartProps {
  /** Per-interval data. Falls back to built-in mock data when omitted. */
  data?: Partial<Record<BalancesChartInterval, BalancesChartDataPoint[]>>;
  className?: string;
}

const chartConfig = BALANCE_CURRENCY_META.reduce<ChartConfig>(
  (acc, { key, label, color }) => ({ ...acc, [key]: { label, color } }),
  {}
);

const ALL_KEYS = new Set<BalanceCurrencyKey>(
  BALANCE_CURRENCY_META.map((c) => c.key)
);

export function BalancesChart({ data, className }: BalancesChartProps) {
  const [activeInterval, setActiveInterval] = useState<BalancesChartInterval>("3D");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCurrencies, setActiveCurrencies] = useState<Set<BalanceCurrencyKey>>(
    new Set(ALL_KEYS)
  );

  const activeLabel =
    BALANCES_CHART_INTERVALS.find((i) => i.id === activeInterval)?.label ?? "3 days";

  const chartData = data?.[activeInterval] ?? BALANCES_CHART_MOCK_DATA[activeInterval];

  const visibleCurrencies = BALANCE_CURRENCY_META.filter((c) =>
    activeCurrencies.has(c.key)
  );

  function toggleCurrency(key: BalanceCurrencyKey) {
    setActiveCurrencies((prev) => {
      // Prevent deselecting the last active currency
      if (prev.has(key) && prev.size === 1) return prev;
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Title */}
      <SectionHeader>Balance chart</SectionHeader>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Currency filter pills */}
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {BALANCE_CURRENCY_META.map(({ key, label, color }) => {
            const isActive = activeCurrencies.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleCurrency(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-2xs font-medium transition-all",
                  isActive
                    ? "bg-main-lightGray text-main-darkPurple"
                    : "bg-main-lightGray/50 text-main-darkPurple/35"
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full transition-colors"
                  style={{ backgroundColor: isActive ? color : "#dad8e6" }}
                />
                {label}
              </button>
            );
          })}
        </div>

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
              <div className="absolute right-0 z-20 mt-1.5 min-w-[100px] overflow-hidden rounded-md bg-white shadow-[0_4px_20px_rgba(45,39,75,0.12)]">
                {BALANCES_CHART_INTERVALS.map((interval) => (
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

      {/* Chart */}
      <div className="rounded-md bg-main-lightGray/50 p-3">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <defs>
              {BALANCE_CURRENCY_META.map(({ key, color }) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}    />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} stroke="#dad8e6" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#9787f4" }}
              tickMargin={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#9787f4" }}
              tickMargin={4}
            />
            <ChartTooltip
              cursor={{ stroke: "#dad8e6", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />

            {visibleCurrencies.map(({ key, color }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${key})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
