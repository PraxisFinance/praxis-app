import Image from "next/image";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PREDICTIONS_OVERALL_STATS_MOCK } from "@/shared/constants/profile";
import type {
  CurrencyStat,
  MatchStat,
  PredictionsOverallStatsData,
} from "@/shared/types/profile";

// ── Sub-components ────────────────────────────────────────────────────────

function MatchStatCard({ stat }: { stat: MatchStat }) {
  const icon = {
    won:     <ArrowUp   className="size-5 text-main-success"     strokeWidth={2.5} />,
    lost:    <ArrowDown className="size-5 text-main-red"         strokeWidth={2.5} />,
    pending: <RefreshCw className="size-5 text-main-purple"      strokeWidth={2.5} />,
  }[stat.kind];

  return (
    <div className="flex flex-1 flex-col justify-between gap-2 rounded-sm bg-main-lightGray p-3">
      <span className="text-xs font-normal text-main-darkPurple/60 leading-4">
        {stat.label}
      </span>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-main-darkPurple text-md tabular-nums leading-6">
          {stat.value}
        </span>
      </div>
    </div>
  );
}

function CurrencyStatCard({ stat }: { stat: CurrencyStat }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-2 rounded-sm bg-main-lightGray p-3">
      <span className="text-xs font-normal text-main-darkPurple/60 leading-4">
        {stat.label}
      </span>
      <div className="flex items-center gap-2">
        <Image src="/icons/w-usdc.png" alt="wUSDC" width={20} height={20} className="shrink-0" />
        <span className="text-main-darkPurple text-md tabular-nums leading-6">
          {stat.amount.toLocaleString()}&nbsp;
          <span className="text-sm font-medium">{stat.currency}</span>
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export interface PredictionsOverallStatsProps {
  data?: PredictionsOverallStatsData;
  className?: string;
}

export function PredictionsOverallStats({
  data = PREDICTIONS_OVERALL_STATS_MOCK,
  className,
}: PredictionsOverallStatsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <SectionHeader>Predictions overall stats</SectionHeader>

      {/* Row 1 — match counts */}
      <div className="flex gap-2">
        {data.matchStats.map((stat) => (
          <MatchStatCard key={stat.kind} stat={stat} />
        ))}
      </div>

      {/* Row 2 — currency totals */}
      <div className="flex gap-2">
        {data.currencyStats.map((stat) => (
          <CurrencyStatCard key={stat.kind} stat={stat} />
        ))}
      </div>
    </div>
  );
}
