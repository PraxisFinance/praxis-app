"use client";

import { Button } from "@/components/ui/button";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { RandomPoolUserInPool } from "@/shared/types/randomPool";
import { RandomPoolParticipantList } from "./RandomPoolParticipantList";

export interface RandomPoolLiveDetailsProps {
  amount: string;
  onAmountChange: (value: string) => void;
  walletBalance: string;
  participants?: RandomPoolUserInPool[];
}

export function RandomPoolLiveDetails({
  amount,
  onAmountChange,
  walletBalance,
  participants = [],
}: RandomPoolLiveDetailsProps) {
  return (
    <div className="flex flex-col gap-3">
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
        <Button type="button" variant="success" size="action">
          Join pool
        </Button>
      </section>

      <RandomPoolParticipantList title="Users in pool" users={participants} />
    </div>
  );
}
