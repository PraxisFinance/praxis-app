"use client";

import { Button } from "@/components/ui/button";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MOCK_USERS_IN_POOL } from "@/shared/constants/randomRewards";
import type { RandomPoolLive } from "@/shared/types/randomPool";
import { RandomPoolMainData } from "./RandomPoolMainData";
import { RandomPoolParticipantList } from "./RandomPoolParticipantList";

export interface RandomPoolLiveDetailsProps {
  pool: RandomPoolLive;
  amount: string;
  onAmountChange: (value: string) => void;
  walletBalance: string;
}

export function RandomPoolLiveDetails({
  pool,
  amount,
  onAmountChange,
  walletBalance,
}: RandomPoolLiveDetailsProps) {
  return (
    <div className="flex flex-col gap-3">
      <RandomPoolMainData pool={pool} />

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">Join Pool</SectionHeader>
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

      <RandomPoolParticipantList title="Users in pool" users={MOCK_USERS_IN_POOL} />
    </div>
  );
}
