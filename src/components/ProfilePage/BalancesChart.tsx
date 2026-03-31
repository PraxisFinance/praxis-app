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
import { SectionHeader } from "../ui";

export type BalancesChartInterval = "1D" | "3D" | "7D" | "1M" | "1Y";

export interface BalancesChartDataPoint {
  date: string;
  balance: number;
}

export interface BalancesChartProps {
  data?: BalancesChartDataPoint[];
  className?: string;
}

const INTERVALS: { id: BalancesChartInterval; label: string }[] = [
  { id: "1D", label: "1 day" },
  { id: "3D", label: "3 days" },
  { id: "7D", label: "7 days" },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year" },
];

const chartConfig = {
  balance: {
    label: "Balance",
    color: "#9787f4",
  },
} satisfies ChartConfig;

export function BalancesChart({ data = [], className }: BalancesChartProps) {
  const [activeInterval, setActiveInterval] = useState<BalancesChartInterval>("3D");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLabel = INTERVALS.find((i) => i.id === activeInterval)?.label ?? "3 days";

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionHeader>Balance chart</SectionHeader>

        {/* Interval selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-sm bg-main-lightGray px-3 py-1.5 text-xs font-medium text-main-darkPurple transition-colors hover:bg-main-grayPurple"
          >
            {activeLabel}
            <ChevronDown
              className={cn("size-3.5 transition-transform duration-200", dropdownOpen && "rotate-180")}
            />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 z-20 mt-1.5 min-w-[100px] overflow-hidden rounded-[8px] bg-white shadow-[0_4px_20px_rgba(45,39,75,0.12)]">
                {INTERVALS.map((interval) => (
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
      <div className="rounded-[12px] bg-main-lightGray/50 p-3">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9787f4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9787f4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#dad8e6"
              strokeDasharray="3 3"
            />
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
              cursor={{ stroke: "#9787f4", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#9787f4"
              strokeWidth={2}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#9787f4", strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
