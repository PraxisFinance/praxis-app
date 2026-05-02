import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PREDICTIONS_OVERALL_STATS_MOCK } from "@/shared/constants/profile";
import type { PredictionsOverallStatsData } from "@/shared/types/profile";
import { MatchStatCard } from "./MatchStatCard";
import { CurrencyStatCard } from "./CurrencyStatCard";

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

      <div className="flex gap-2">
        {data.matchStats.map((stat) => (
          <MatchStatCard key={stat.kind} stat={stat} />
        ))}
      </div>

      <div className="flex gap-2">
        {data.currencyStats.map((stat) => (
          <CurrencyStatCard key={stat.kind} stat={stat} />
        ))}
      </div>
    </div>
  );
}
