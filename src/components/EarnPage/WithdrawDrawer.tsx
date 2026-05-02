"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnPosition } from "@/shared/types/earn";
import { useVaultWithdraw } from "@/hooks/useVault";
import { useWalletBalances } from "@/hooks/useWalletBalances";

interface WithdrawDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawDrawer({ item, open, onOpenChange }: WithdrawDrawerProps) {
  const [amount, setAmount] = useState("");
  const { refetch: refetchBalances } = useWalletBalances();
  const { withdraw, status, errorMessage, reset, isPending } = useVaultWithdraw(
    item?.vaultAddress ?? "0x0",
    amount,
  );

  useEffect(() => {
    if (!open) {
      setAmount("");
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (status === "success") {
      refetchBalances();
    }
  }, [status, refetchBalances]);

  if (!item) return null;

  const availableAmount = item.yourDeposit;

  function handleWithdraw() {
    withdraw();
  }

  function handleClose() {
    setAmount("");
    reset();
    onOpenChange(false);
  }

  const buttonLabel =
    status === "withdrawing"
      ? "Withdrawing…"
      : status === "success"
        ? "Done"
        : "Withdraw";

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <AppDrawerHeading
        variant="plain"
        title="Withdraw your deposit"
        description="Withdraw your cryptocurrency from pool vault."
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

      <div className="flex flex-col gap-2">
        <span className="text-main-darkPurple text-lg leading-6">Amount</span>

        <InputWithMax
          value={amount}
          onChange={setAmount}
          maxValue={availableAmount}
          disabled={isPending}
        />

        <div className="flex items-center justify-between px-1">
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            Available: {availableAmount} ${item.depositCurrency}
          </span>
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            Yield generated: {item.yieldGenerated} {item.depositCurrency}
          </span>
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-xs px-1">{errorMessage}</p>
      )}

      {status === "success" ? (
        <Button variant="destructiveMuted" size="action" onClick={handleClose}>
          {buttonLabel}
        </Button>
      ) : (
        <Button
          variant="destructiveMuted"
          size="action"
          onClick={handleWithdraw}
          disabled={isPending || !amount || Number(amount) <= 0}
        >
          {buttonLabel}
        </Button>
      )}
    </DrawerShell>
  );
}
