"use client";

import { Balances } from "../Balances/Balances";
import { BalancesChart } from "./BalancesChart";
import { PredictionsOverallStats } from "./PredictionsOverallStats";

export function BalancesSubPage() {
  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <BalancesChart />
      <PredictionsOverallStats />
    </div>
  );
}
