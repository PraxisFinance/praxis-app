"use client";

import { useEffect } from "react";
import { HintIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { WITHDRAW_PRINCIPAL_NOTE } from "@/shared/constants/earn";
import type { EarnPosition } from "@/shared/types/earn";
import { useVaultWithdraw } from "@/hooks/useVault";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { AlertIcon } from "../icons/base/alertIcon";

interface WithdrawDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPoolLifetimeDisplay(lifetime: string): string {
  return lifetime.replace(/ \d+s$/, "");
}

export function WithdrawDrawer({ item, open, onOpenChange }: WithdrawDrawerProps) {
  const withdrawAmount = item?.yourDeposit ?? "";
  const { refetch: refetchBalances } = useWalletBalances();
  const { withdraw, status, errorMessage, reset, isPending } = useVaultWithdraw(
    item?.vaultAddress ?? "0x0",
    withdrawAmount
  );

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (status === "success") {
      refetchBalances();
    }
  }, [status, refetchBalances]);

  if (!item) return null;

  function handleWithdraw() {
    withdraw();
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  const buttonLabel =
    status === "withdrawing" ? "Withdrawing…" : status === "success" ? "Done" : "Withdraw";

  const currencySuffix = ` ${item.depositCurrency}`;

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <AppDrawerHeading
        variant="plain"
        title="Claim your deposit from ended vault"
        description="Withdraw your cryptocurrency from pool vault."
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

      <div className="flex items-start gap-2">
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-main-grayPurple text-main-darkPurple"
          aria-hidden
        >
          <AlertIcon className="h-3 w-3" />
        </span>
        <p className="text-main-darkPurple/70 text-xs font-normal leading-4">
          {WITHDRAW_PRINCIPAL_NOTE}
        </p>
      </div>

      {errorMessage && <p className="text-red-500 text-xs px-1">{errorMessage}</p>}

      {status === "success" ? (
        <Button variant="destructiveBrand" size="action" onClick={handleClose}>
          {buttonLabel}
        </Button>
      ) : (
        <Button
          variant="destructiveBrand"
          size="action"
          onClick={handleWithdraw}
          disabled={isPending || !withdrawAmount || Number(withdrawAmount) <= 0}
        >
          {buttonLabel}
        </Button>
      )}
    </DrawerShell>
  );
}
