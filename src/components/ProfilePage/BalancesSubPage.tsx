"use client";

import { BalancesChart } from "./BalancesChart";
import { PredictionsOverallStats } from "./PredictionsOverallStats";
import { PredictionsStatsChart } from "./PredictionsStatsChart";
import { Balances } from "../Balances/Balances";

export function BalancesSubPage() {
  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <BalancesChart />
      <PredictionsOverallStats />
      <PredictionsStatsChart />
    </div>
  );
}
