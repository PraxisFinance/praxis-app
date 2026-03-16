"use client";

import Image from "next/image";
import { BalanceCard } from "./ui/BalanceCard";

interface Balance {
  label: string;
  value: string;
  iconUrl: string;
}

interface BalancesProps {
  balances?: Balance[];
}

const defaultBalances: Balance[] = [
  { label: "Wallet",   value: "10.000", iconUrl: "/icons/usdc.png" },
  { label: "Deposit",  value: "1.000",  iconUrl: "/icons/usdt.png" },
  { label: "YT Token", value: "100",    iconUrl: "/icons/yt-token.png" },
];

export function Balances({ balances = defaultBalances }: BalancesProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-indigo-950 text-xl font-medium leading-6">Balances</h2>
        <Image src="/icons/question.png" alt="Info" width={14} height={14} />
      </div>
      <div className="flex flex-wrap gap-2.5">
        {balances.map((balance) => (
          <BalanceCard
            key={balance.label}
            label={balance.label}
            value={balance.value}
            iconUrl={balance.iconUrl}
          />
        ))}
      </div>
    </section>
  );
}
