"use client";

import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnPosition } from "@/shared/types/earn";

interface ClaimDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimDrawer({ item, open, onOpenChange }: ClaimDrawerProps) {
  if (!item) return null;

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <AppDrawerHeading
        variant="plain"
        title="Claim your deposit from ended vault"
        description="Withdraw your cryptocurrency from ended pool vault."
      />

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

      <Button variant="primary" size="action">
        Claim Funds
      </Button>
    </DrawerShell>
  );
}
