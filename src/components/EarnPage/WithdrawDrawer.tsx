"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnPosition } from "@/shared/types/earn";

interface WithdrawDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawDrawer({ item, open, onOpenChange }: WithdrawDrawerProps) {
  const [amount, setAmount] = useState("");

  if (!item) return null;

  const availableAmount = item.yourDeposit;

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-1.5">
        <Drawer.Title className="text-main-darkPurple text-2xl leading-tight">
          Withdraw your deposit
        </Drawer.Title>
        <p className="text-main-darkPurple text-sm font-normal leading-5">
          Withdraw your cryptocurrency from pool vault.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-main-darkPurple text-lg leading-6">Pool Information</span>

        <div className="flex flex-col gap-2.5">
          <PoolHeader iconUrl={item.depositCurrencyIconUrl} name={item.queueName} />

          <div className="flex flex-col gap-1.5">
            <InfoRow label="Your deposit:" value={`${item.yourDeposit} ${item.depositCurrency}`} />
            <InfoRow label="Yield APY:" value={`${item.yieldApyPercent}%`} />
            <InfoRow
              label="Yield generated:"
              value={`${item.yieldGenerated} ${item.depositCurrency}`}
            />
            <InfoRow label="Stake date:" value={`${item.stakeTime} ${item.stakeDate}`} />
            <InfoRow label="Pool lifetime:" value={item.poolLifetime} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-main-darkPurple text-lg leading-6">Amount</span>

        <InputWithMax value={amount} onChange={setAmount} maxValue={availableAmount} />

        <div className="flex items-center justify-between px-1">
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            Available: {availableAmount} ${item.depositCurrency}
          </span>
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            Yield generated: {item.yieldGenerated} {item.depositCurrency}
          </span>
        </div>
      </div>

      <Button variant="destructiveMuted" size="action">
        Withdraw
      </Button>
    </DrawerShell>
  );
}
