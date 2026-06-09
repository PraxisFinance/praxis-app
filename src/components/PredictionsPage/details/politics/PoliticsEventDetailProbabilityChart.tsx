"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { PoliticsProbabilityChartPoint } from "@/shared/types/politicsHubEvent";
import { formatPoliticsPoolPercent } from "@/shared/utils/politicsHubEventFormat";

const POLITICS_YES_LINE_COLOR = "#34c53e";

const chartConfig = {
  yesPercent: { label: "Yes", color: POLITICS_YES_LINE_COLOR },
} satisfies ChartConfig;

interface PoliticsEventDetailProbabilityChartProps {
  points: PoliticsProbabilityChartPoint[];
}

export function PoliticsEventDetailProbabilityChart({ points }: PoliticsEventDetailProbabilityChartProps) {
  const lastYesPercent = useMemo(() => {
    const last = points[points.length - 1];
    return last?.yesPercent ?? 0;
  }, [points]);

  const percentLabel = formatPoliticsPoolPercent(lastYesPercent);
  /** Align label vertically with the last point on the 0–100% scale. */
  const percentLabelTopPx = 16 + (100 - lastYesPercent) * 1.15;

  return (
    <section className="bg-main-lightGray rounded-[10px] p-3">
      <div className="relative">
        <span className="text-main-darkPurple/55 absolute top-0 left-0 z-10 text-2xs leading-tight">
          Probability
        </span>
        <span
          className="pointer-events-none absolute right-3 z-10 text-2xs leading-tight font-semibold tabular-nums"
          style={{ color: POLITICS_YES_LINE_COLOR, top: `${percentLabelTopPx}px` }}
        >
          {percentLabel}
        </span>
        <ChartContainer config={chartConfig} className="h-[160px] w-full">
          <LineChart data={points} margin={{ top: 16, right: 4, bottom: 0, left: -8 }}>
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
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Line
              type="monotone"
              dataKey="yesPercent"
              stroke={POLITICS_YES_LINE_COLOR}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: POLITICS_YES_LINE_COLOR, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </section>
  );
}
