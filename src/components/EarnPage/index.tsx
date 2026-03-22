"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Balances } from "../Balances/Balances";
import { EarnAvailableCard } from "./EarnAvailableCard";
import { EarnMyPositionsCard } from "./EarnMyPositionsCard";
import { DepositDrawer } from "./DepositDrawer";
import { WithdrawDrawer } from "./WithdrawDrawer";
import { ClaimDrawer } from "./ClaimDrawer";
import { EARN_AVAILABLE_ITEMS, EARN_MY_POSITIONS } from "@/shared/constants/earn";
import type { EarnAvailableItem, EarnPosition } from "@/shared/types/earn";

export function EarnPage() {
  const [selectedAvailableItem, setSelectedAvailableItem] = useState<EarnAvailableItem | null>(null);
  const [depositDrawerOpen, setDepositDrawerOpen] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState<EarnPosition | null>(null);
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false);
  const [claimDrawerOpen, setClaimDrawerOpen] = useState(false);

  function handleDeposit(item: EarnAvailableItem) {
    setSelectedAvailableItem(item);
    setDepositDrawerOpen(true);
  }

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
        <SectionHeader>My positions</SectionHeader>
        <div className="flex flex-col gap-3">
          {EARN_MY_POSITIONS.map((item) => (
            <EarnMyPositionsCard
              key={`${item.queueName}-${item.stakeDate}`}
              item={item}
              onWithdraw={handleWithdraw}
              onClaim={handleClaim}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader>Available pools</SectionHeader>
        <div className="flex flex-col gap-3">
          {EARN_AVAILABLE_ITEMS.map((item) => (
            <EarnAvailableCard key={item.queueName} item={item} onDeposit={handleDeposit} />
          ))}
        </div>
      </section>

      <DepositDrawer
        item={selectedAvailableItem}
        open={depositDrawerOpen}
        onOpenChange={setDepositDrawerOpen}
      />
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
