"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnAvailableItem } from "@/shared/types/earn";
import { getBalanceValueByIconUrl } from "@/shared/constants/balances";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useVaultDeposit } from "@/hooks/useVault";
import { RequestResultForm } from "@/components/ui/RequestResultForm";

interface DepositDrawerProps {
  item: EarnAvailableItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDrawer({ item, open, onOpenChange }: DepositDrawerProps) {
  const [amount, setAmount] = useState("");
  const { balances, raw, refetchAfterDelay } = useWalletBalances();
  const { deposit, status, errorMessage, reset, buyIn, totalCost, insufficientBalance, isPending } =
    useVaultDeposit(item?.vaultAddress ?? "0x0", amount, raw.usdc);

  useEffect(() => {
    if (!open) {
      setAmount("");
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (status === "success") {
      void refetchAfterDelay();
    }
  }, [status, refetchAfterDelay]);

  if (!item) return null;

  const walletBalance = getBalanceValueByIconUrl(balances, item.depositCurrencyIconUrl);

  function handleDeposit() {
    deposit();
  }

  function handleClose() {
    setAmount("");
    reset();
    onOpenChange(false);
  }

  const buttonLabel =
    status === "approving"
      ? "Approving USDC…"
      : status === "depositing"
        ? "Depositing…"
        : status === "success"
          ? "Done"
          : "Deposit";

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      {status === "error" && (
        <div className="fixed bottom-0 left-0 right-0 z-[80] max-w-md mx-auto bg-main-lightGray rounded-t-3xl flex flex-col items-center justify-center gap-6 px-5 pb-10 pt-8">
          <RequestResultForm
            status="failed"
            title="Deposit Failed"
            description={errorMessage ?? "Something went wrong. Please try again."}
          />
          <Button variant="success" size="action" onClick={reset}>
            Close
          </Button>
        </div>
      )}

      <AppDrawerHeading
        title="Deposit your cryptocurrency"
        description="Deposit cryptocurrency from your wallet into the vault to start earn."
      />

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

        <InputWithMax
          value={amount}
          onChange={setAmount}
          maxValue={walletBalance}
          disabled={isPending}
        />

        <div className="flex items-center justify-between px-1">
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            Available: {walletBalance} ${item.depositCurrency}
          </span>
          <span className="text-main-darkPurple text-xs font-normal leading-4">
            APY: {item.yieldApyPercent}%&nbsp;&nbsp;Payment %: {item.ytPayoutTime}
          </span>
        </div>

        {amount && Number(amount) > 0 && (
          <div className="flex flex-col gap-1 px-1 pt-1">
            <InfoRow label="Buy-in cost:" value={`${buyIn} ${item.depositCurrency}`} />
            <InfoRow label="Total cost:" value={`${totalCost} ${item.depositCurrency}`} />
            {insufficientBalance && (
              <span className="text-red-500 text-xs mt-0.5">
                Total cost exceeds your balance of {walletBalance} {item.depositCurrency}
              </span>
            )}
          </div>
        )}
      </div>

      {status === "success" ? (
        <Button variant="success" size="action" onClick={handleClose}>
          {buttonLabel}
        </Button>
      ) : (
        <Button
          variant="success"
          size="action"
          onClick={handleDeposit}
          disabled={isPending || !amount || Number(amount) <= 0 || insufficientBalance}
        >
          {insufficientBalance ? "Insufficient balance (includes buy-in fee)" : buttonLabel}
        </Button>
      )}
    </DrawerShell>
  );
}
