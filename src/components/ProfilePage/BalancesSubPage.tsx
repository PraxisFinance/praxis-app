"use client";

import { Balances } from "../Balances/Balances";
import { BalancesChart } from "./BalancesChart";

export function BalancesSubPage() {
  return (
    <div className="flex flex-col gap-4">
      <Balances />
      <BalancesChart />
    </div>
  );
}
