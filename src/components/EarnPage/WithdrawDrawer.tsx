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
import { AlertIcon } from "../icons/base/alertIcon";
import { WITHDRAW_PRINCIPAL_NOTE } from "@/shared/constants/earn";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";

interface WithdrawDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPoolLifetimeDisplay(lifetime: string): string {
  return lifetime.replace(/ \d+s$/, "");
}

export function WithdrawDrawer({ item, open, onOpenChange }: WithdrawDrawerProps) {
  const [amount, setAmount] = useState("");
  const maxWithdrawAmount = item?.yourDeposit ?? "";
  const { refetch: refetchBalances } = useWalletBalances();
  const { withdraw, status, errorMessage, reset, isPending } = useVaultWithdraw(
    item?.vaultAddress ?? "0x0",
    amount
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

  function handleWithdraw() {
    withdraw();
  }

  function handleClose() {
    setAmount("");
    reset();
    onOpenChange(false);
  }

  const buttonLabel =
    status === "withdrawing" ? "Withdrawing…" : status === "success" ? "Done" : "Withdraw";

  const exceedsDeposit =
    amount !== "" && Number(amount) > 0 && Number(amount) > Number(maxWithdrawAmount);

  const currencySuffix = ` ${item.depositCurrency}`;

  return (
    <>
      <RequestResultDialog
        open={status === "error"}
        onClose={reset}
        title="Withdrawal Failed"
        description={errorMessage ?? "Something went wrong. Please try again."}
      />

      <RequestResultDialog
        open={status === "success"}
        onClose={handleClose}
        status="success"
        title="Withdrawal Successful"
        description="Your funds have been withdrawn to your wallet."
        closeLabel="Done"
      />

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

        <div className="flex flex-col gap-2">
          <span className="text-main-darkPurple text-lg font-bold leading-6">Amount</span>

          <InputWithMax
            value={amount}
            onChange={setAmount}
            maxValue={maxWithdrawAmount}
            disabled={isPending}
          />

          <div className="flex items-center justify-between px-1">
            <span className="text-main-darkPurple text-xs font-normal leading-4">
              Available: {maxWithdrawAmount}
              {currencySuffix}
            </span>
          </div>

          {exceedsDeposit && (
            <span className="text-red-500 text-xs px-1">
              Amount exceeds your deposit of {maxWithdrawAmount}
              {currencySuffix}
            </span>
          )}
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

        {status === "success" ? (
          <Button variant="destructiveBrand" size="action" onClick={handleClose}>
            {buttonLabel}
          </Button>
        ) : (
          <Button
            variant="destructiveBrand"
            size="action"
            onClick={handleWithdraw}
            disabled={isPending || !amount || Number(amount) <= 0 || exceedsDeposit}
          >
            {buttonLabel}
          </Button>
        )}
      </DrawerShell>
    </>
  );
}
