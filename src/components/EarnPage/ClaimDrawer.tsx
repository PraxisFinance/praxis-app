"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnPosition } from "@/shared/types/earn";
import { useVaultRedeemYield } from "@/hooks/useVault";
import { useWalletBalances } from "@/hooks/useWalletBalances";

interface ClaimDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimDrawer({ item, open, onOpenChange }: ClaimDrawerProps) {
  const { refetch: refetchBalances } = useWalletBalances();
  const ytAmount = item?.yieldGenerated ?? "0";
  const { redeemYield, status, errorMessage, reset, isPending } = useVaultRedeemYield(
    item?.vaultAddress ?? "0x0",
    ytAmount,
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

  function handleClaim() {
    redeemYield();
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  const buttonLabel =
    status === "redeeming"
      ? "Claiming…"
      : status === "success"
        ? "Done"
        : "Claim Funds";

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

      {errorMessage && (
        <p className="text-red-500 text-xs px-1">{errorMessage}</p>
      )}

      {status === "success" ? (
        <Button variant="primary" size="action" onClick={handleClose}>
          {buttonLabel}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="action"
          onClick={handleClaim}
          disabled={isPending}
        >
          {buttonLabel}
        </Button>
      )}
    </DrawerShell>
  );
}
