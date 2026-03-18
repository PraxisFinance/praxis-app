"use client";

import { useState } from "react";
import { Balances } from "../Balances/Balances";
import { EarnAvailableCard } from "./EarnAvailableCard";
import { EarnMyPositionsCard } from "./EarnMyPositionsCard";
import { DepositDrawer } from "./DepositDrawer";
import { EARN_AVAILABLE_ITEMS, EARN_MY_POSITIONS } from "@/shared/constants/earn";
import type { EarnAvailableItem } from "@/shared/types/earn";

export function EarnPage() {
  const [selectedItem, setSelectedItem] = useState<EarnAvailableItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleDeposit(item: EarnAvailableItem) {
    setSelectedItem(item);
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <h2 className="text-indigo-950 text-xl font-medium leading-6">My positions</h2>
        <div className="flex flex-col gap-3">
          {EARN_MY_POSITIONS.map((item) => (
            <EarnMyPositionsCard key={`${item.queueName}-${item.stakeDate}`} item={item} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-indigo-950 text-xl font-medium leading-6">Available pools</h2>
        <div className="flex flex-col gap-3">
          {EARN_AVAILABLE_ITEMS.map((item) => (
            <EarnAvailableCard key={item.queueName} item={item} onDeposit={handleDeposit} />
          ))}
        </div>
      </section>

      <DepositDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
