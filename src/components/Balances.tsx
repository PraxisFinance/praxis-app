"use client";

import { BalanceCard } from "./ui/BalanceCard";

interface Balance {
  label: string;
  value: string;
  iconUrl?: string;
  icon?: React.ReactNode;
}

interface BalancesProps {
  balances?: Balance[];
}

function YTTokenIcon() {
  return (
    <div className="w-4 h-4 relative">
      <div className="w-4 h-4 bg-violet-400 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] font-bold text-white">Y</span>
      </div>
    </div>
  );
}

function USDCIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
      <span className="text-[8px] font-bold text-white">$</span>
    </div>
  );
}

const defaultBalances: Balance[] = [
  { label: "Wallet", value: "10,000", icon: <USDCIcon /> },
  { label: "Deposit", value: "1,000", icon: <USDCIcon /> },
  { label: "YT Token", value: "100", icon: <YTTokenIcon /> },
];

export function Balances({ balances = defaultBalances }: BalancesProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-indigo-950 text-xl font-medium leading-6">Balances</h2>
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.75" y="1.75" width="10.5" height="10.5" rx="1" stroke="#1e1b4b" strokeWidth="1"/>
        </svg>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {balances.map((balance, index) => (
          <BalanceCard
            key={index}
            label={balance.label}
            value={balance.value}
            iconUrl={balance.iconUrl}
            icon={balance.icon}
          />
        ))}
      </div>
    </section>
  );
}
