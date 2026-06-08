"use client";

import { ChevronDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Label } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { CryptoPredictionPriceChartPoint } from "@/shared/types/cryptoPrediction";

const chartConfig = {
  price: { label: "Price", color: "#3d9a5f" },
} satisfies ChartConfig;

interface CryptoPredictionHubDetailPriceChartProps {
  baselinePriceLabel: string;
  points: CryptoPredictionPriceChartPoint[];
}

export function CryptoPredictionHubDetailPriceChart({
  baselinePriceLabel,
  points,
}: CryptoPredictionHubDetailPriceChartProps) {
  const lastPoint = points[points.length - 1];
  const currentPriceLabel = lastPoint
    ? `$${lastPoint.price.toLocaleString("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`
    : "";

  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-main-darkPurple/55 text-xs">
          Baseline price:{" "}
          <span className="text-main-darkPurple font-medium">{baselinePriceLabel}</span>
        </p>
        <button
          type="button"
          className="bg-main-white text-main-darkPurple hover:bg-main-grayPurple/40 inline-flex items-center gap-1 rounded-[5px] px-2.5 py-1 text-xs font-medium transition-colors"
          aria-haspopup="listbox"
          aria-expanded={false}
        >
          Price
          <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </button>
      </div>

      <ChartContainer config={chartConfig} className="h-[140px] w-full">
        <LineChart data={points} margin={{ top: 12, right: 48, bottom: 0, left: -20 }}>
          <CartesianGrid vertical={false} stroke="#dad8e6" strokeDasharray="3 3" />
          <XAxis
            dataKey="timeLabel"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9787f4" }}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--color-price)"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          >
            {lastPoint ? (
              <Label
                value={currentPriceLabel}
                position="right"
                offset={8}
                fill="#3d9a5f"
                fontSize={11}
                fontWeight={600}
              />
            ) : null}
          </Line>
        </LineChart>
      </ChartContainer>
    </section>
  );
}
