import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PredictionsOverallStatsData } from "@/shared/types/profile";
import { MatchStatCard } from "./MatchStatCard";
import { CurrencyStatCard } from "./CurrencyStatCard";

const EMPTY_OVERALL_STATS: PredictionsOverallStatsData = {
  matchStats: [
    { kind: "won", label: "Won matches", value: 0 },
    { kind: "lost", label: "Lose matches", value: 0 },
    { kind: "pending", label: "Pending matches", value: 0 },
  ],
  currencyStats: [
    { kind: "won", label: "Won currency", amount: 0, currency: "$YT" },
    { kind: "lost", label: "Lost currency", amount: 0, currency: "$YT" },
  ],
};

export interface PredictionsOverallStatsProps {
  data?: PredictionsOverallStatsData;
  className?: string;
}

export function PredictionsOverallStats({
  data = EMPTY_OVERALL_STATS,
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
