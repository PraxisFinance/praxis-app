"use client";

import { Button } from "@/components/ui/button";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface RandomRewardDetailJoinSectionProps {
  amount: string;
  onAmountChange: (value: string) => void;
  walletBalance: string;
  onJoin?: () => void;
}

export function RandomRewardDetailJoinSection({
  amount,
  onAmountChange,
  walletBalance,
  onJoin,
}: RandomRewardDetailJoinSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">
        Join Pool
      </SectionHeader>
      <InputWithMax
        value={amount}
        onChange={onAmountChange}
        maxValue={walletBalance}
        placeholder="Deposit amount"
      />
      <Button type="button" variant="success" size="action" className="h-8 text-white" onClick={onJoin}>
        Join pool
      </Button>
    </section>
  );
}
