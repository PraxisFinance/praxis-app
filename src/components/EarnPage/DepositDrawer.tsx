"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnAvailableItem } from "@/shared/types/earn";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";

interface DepositDrawerProps {
  item: EarnAvailableItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDrawer({ item, open, onOpenChange }: DepositDrawerProps) {
  const [amount, setAmount] = useState("");

  if (!item) return null;

  const walletBalance =
    DEFAULT_BALANCES.find((b) => b.iconUrl === item.depositCurrencyIconUrl)?.value ?? "0.000";

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-1.5">
        <Drawer.Title className="text-main-darkPurple text-2xl font-bold leading-tight">
          Deposit your cryptocurrency
        </Drawer.Title>
        <p className="text-main-darkPurple text-sm font-normal leading-5">
          Deposit cryptocurrency from your wallet into the vault to start earn.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-main-darkPurple text-lg font-bold leading-6">Pool Information</span>

        <div className="flex flex-col gap-2.5">
          <PoolHeader iconUrl={item.depositCurrencyIconUrl} name={item.queueName} emphasized />

          <div className="flex flex-col gap-1.5">
            <InfoRow label="Deposits:" value={`${item.depositsAmount} ${item.depositCurrency}`} />
            <InfoRow label="Liquidity:" value={`${item.liquidityAmount} ${item.depositCurrency}`} />
            <InfoRow label="Yield Apy:" value={`${item.yieldApyPercent}%`} />
            <InfoRow label="Pool lifetime:" value={item.poolLifetime} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-main-darkPurple text-lg font-bold leading-6">Amount</span>

        <InputWithMax value={amount} onChange={setAmount} maxValue={walletBalance} />

        <div className="flex items-center justify-between px-1">
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            Available: {walletBalance} ${item.depositCurrency}
          </span>
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            APY: {item.yieldApyPercent}%&nbsp;&nbsp;Payment %: {item.ytPayoutTime}
          </span>
        </div>
      </div>

      <Button variant="success" size="action">
        Deposit
      </Button>
    </DrawerShell>
  );
}
