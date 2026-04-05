"use client";

import { useState } from "react";
import { Balances } from "../Balances/Balances";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EarnMyPositionsCard } from "../EarnPage/EarnMyPositionsCard";
import { WithdrawDrawer } from "../EarnPage/WithdrawDrawer";
import { ClaimDrawer } from "../EarnPage/ClaimDrawer";
import type { EarnPosition } from "@/shared/types/earn";
import { EARN_MY_POSITIONS } from "@/shared/constants/earn";

interface DepositsSubPageProps {
  positions?: EarnPosition[];
}

export function DepositsSubPage({ positions = EARN_MY_POSITIONS }: DepositsSubPageProps) {
  const [selectedPosition, setSelectedPosition] = useState<EarnPosition | null>(null);
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false);
  const [claimDrawerOpen, setClaimDrawerOpen] = useState(false);

  function handleWithdraw(item: EarnPosition) {
    setSelectedPosition(item);
    setWithdrawDrawerOpen(true);
  }

  function handleClaim(item: EarnPosition) {
    setSelectedPosition(item);
    setClaimDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <SectionHeader>Deposits</SectionHeader>

        <div className="flex flex-col gap-3">
          {positions.map((item) => (
            <EarnMyPositionsCard
              key={`${item.queueName}-${item.stakeDate}`}
              item={item}
              onWithdraw={handleWithdraw}
              onClaim={handleClaim}
            />
          ))}
        </div>
      </section>

      <WithdrawDrawer
        item={selectedPosition}
        open={withdrawDrawerOpen}
        onOpenChange={setWithdrawDrawerOpen}
      />
      <ClaimDrawer
        item={selectedPosition}
        open={claimDrawerOpen}
        onOpenChange={setClaimDrawerOpen}
      />
    </div>
  );
}
