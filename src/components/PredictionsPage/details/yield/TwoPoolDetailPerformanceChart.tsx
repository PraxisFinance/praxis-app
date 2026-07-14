"use client";

import { ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { TwoPoolApyChartPoint } from "@/shared/types/twoPool";

const APY_AREA_COLOR = "#34c53e";

const chartConfig = {
  apyPercent: { label: "APY", color: APY_AREA_COLOR },
} satisfies ChartConfig;

interface TwoPoolDetailPerformanceChartProps {
  points: TwoPoolApyChartPoint[];
}

export function TwoPoolDetailPerformanceChart({ points }: TwoPoolDetailPerformanceChartProps) {
  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-main-darkPurple/55 text-xs">Performance graphic: APY</p>
        <button
          type="button"
          className="bg-main-white text-main-darkPurple hover:bg-main-grayPurple/40 inline-flex items-center gap-1 rounded-[5px] px-2.5 py-1 text-xs font-medium transition-colors"
          aria-haspopup="listbox"
          aria-expanded={false}
        >
          Performance
          <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </button>
      </div>

      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <AreaChart data={points} margin={{ top: 8, right: 4, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="twoPoolApyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={APY_AREA_COLOR} stopOpacity={0.35} />
              <stop offset="100%" stopColor={APY_AREA_COLOR} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#dad8e6" strokeDasharray="3 3" />
          <XAxis
            dataKey="timeLabel"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9787f4" }}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9787f4" }}
            tickMargin={4}
            domain={[0, 7]}
            ticks={[0, 3.5, 7]}
            tickFormatter={(value) => `${value}%`}
          />
          <Area
            type="monotone"
            dataKey="apyPercent"
            stroke={APY_AREA_COLOR}
            strokeWidth={2}
            fill="url(#twoPoolApyFill)"
            activeDot={{ r: 4, fill: APY_AREA_COLOR, strokeWidth: 0 }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
