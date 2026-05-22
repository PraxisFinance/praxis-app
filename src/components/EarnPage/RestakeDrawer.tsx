"use client";

import { useEffect, useState } from "react";
import { AlertIcon } from "@/components/icons/base/alertIcon";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { Switch } from "@/components/ui/Switch";
import {
  RESTAKE_YIELD_IN_PRINCIPAL_NOTE,
  RESTAKE_YIELD_TO_WALLET_NOTE,
} from "@/shared/constants/earn";
import type { EarnPosition } from "@/shared/types/earn";

interface RestakeDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPoolLifetimeDisplay(lifetime: string): string {
  if (lifetime === "Ended") return lifetime;
  return lifetime.replace(/ \d+s$/, "");
}

export function RestakeDrawer({ item, open, onOpenChange }: RestakeDrawerProps) {
  const [withdrawYield, setWithdrawYield] = useState(false);

  useEffect(() => {
    if (!open) {
      setWithdrawYield(false);
    }
  }, [open]);

  if (!item) return null;

  const yieldNote = withdrawYield ? RESTAKE_YIELD_TO_WALLET_NOTE : RESTAKE_YIELD_IN_PRINCIPAL_NOTE;
  const currencySuffix = ` ${item.depositCurrency}`;

  function handleClose() {
    onOpenChange(false);
  }

  function handleRestake() {
    // TODO: wire on-chain restake (withdrawYield flag)
    handleClose();
  }

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <AppDrawerHeading
        variant="plain"
        title="Restake your deposit from ended vault"
        description="Withdraw your cryptocurrency from ended pool."
      />

      <div className="flex flex-col gap-3">
        <InfoRow
          variant="inline"
          label="Pool Information:"
          value={
            <PoolHeader iconUrl={item.depositCurrencyIconUrl} name={item.queueName} emphasized />
          }
        />

        <div className="flex flex-col gap-1.5">
          <InfoRow
            variant="inline"
            label="Your deposit(PT):"
            value={`${item.yourDeposit}${currencySuffix}`}
          />
          <InfoRow
            variant="inline"
            label="Yield generated(YT):"
            value={`${item.yieldGenerated}${currencySuffix}`}
          />
          <InfoRow variant="inline" label="Yield APY:" value={`${item.yieldApyPercent}%`} />
          <InfoRow variant="inline" label="Deposit time:" value={item.depositTime} />
          <InfoRow
            variant="inline"
            label="Pool lifetime:"
            value={formatPoolLifetimeDisplay(item.poolLifetime)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-main-darkPurple text-sm font-normal leading-5">
            Withdraw yield(YT)
          </span>
          <Switch checked={withdrawYield} onCheckedChange={setWithdrawYield} />
        </div>

        <div className="flex items-start gap-2">
          <span
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-main-grayPurple"
            aria-hidden
          >
            <AlertIcon className="h-3 w-3" />
          </span>
          <p className="text-main-darkPurple/70 text-xs font-normal leading-4">{yieldNote}</p>
        </div>
      </div>

      <Button variant="primary" size="action" onClick={handleRestake}>
        Restake
      </Button>
    </DrawerShell>
  );
}
