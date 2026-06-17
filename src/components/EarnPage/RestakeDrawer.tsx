"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertIcon } from "@/components/icons/base/alertIcon";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { RequestResultForm } from "@/components/ui/RequestResultForm";
import { Switch } from "@/components/ui/Switch";
import {
  RESTAKE_YIELD_IN_PRINCIPAL_NOTE,
  RESTAKE_YIELD_TO_WALLET_NOTE,
} from "@/shared/constants/earn";
import type { EarnAvailableItem, EarnPosition } from "@/shared/types/earn";
import { useVaultDeposit, useVaultRedeemYield, useVaultWithdraw } from "@/hooks/useVault";
import { useWalletBalances } from "@/hooks/useWalletBalances";

interface RestakeDrawerProps {
  item: EarnPosition | null;
  targetVault: EarnAvailableItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPoolLifetimeDisplay(lifetime: string): string {
  if (lifetime === "Ended") return lifetime;
  return lifetime.replace(/ \d+s$/, "");
}

export function RestakeDrawer({ item, targetVault, open, onOpenChange }: RestakeDrawerProps) {
  const [withdrawYield, setWithdrawYield] = useState(false);
  const [amount, setAmount] = useState("");
  const [restaking, setRestaking] = useState(false);

  const vaultAddress: `0x${string}` = item?.vaultAddress ?? "0x0";
  const principalAmount = item?.yourDeposit ?? "";
  const yieldAmount = item?.yieldGenerated ?? "";
  const hasYield = Number(yieldAmount) > 0;

  const { raw, refetch: refetchBalances, refetchAfterDelay } = useWalletBalances();

  const {
    withdraw,
    status: withdrawStatus,
    errorMessage: withdrawError,
    reset: resetWithdraw,
    isPending: isWithdrawing,
  } = useVaultWithdraw(vaultAddress, principalAmount);

  const {
    redeemYield,
    status: redeemStatus,
    errorMessage: redeemError,
    reset: resetRedeem,
    isPending: isRedeeming,
  } = useVaultRedeemYield(vaultAddress, yieldAmount);

  const {
    deposit,
    status: depositStatus,
    errorMessage: depositError,
    reset: resetDeposit,
    isPending: isDepositing,
    buyIn,
    totalCost,
  } = useVaultDeposit(targetVault?.vaultAddress ?? "0x0", amount, raw.usdc);

  // Suggested max deposit: principal + yield when toggle OFF, principal only when toggle ON
  const suggestedAmount = useMemo(() => {
    const p = parseFloat(principalAmount || "0") || 0;
    const y = parseFloat(yieldAmount || "0") || 0;
    const total = withdrawYield ? p : p + y;
    return total > 0 ? String(Math.round(total * 1_000_000) / 1_000_000) : "";
  }, [withdrawYield, principalAmount, yieldAmount]);

  // Pre-populate amount when suggested value changes (toggle or item change)
  useEffect(() => {
    setAmount(suggestedAmount);
  }, [suggestedAmount]);

  // Reset all state when drawer closes
  useEffect(() => {
    if (!open) {
      setWithdrawYield(false);
      setRestaking(false);
      resetWithdraw();
      resetRedeem();
      resetDeposit();
    }
  }, [open, resetWithdraw, resetRedeem, resetDeposit]);

  // Refetch balances whenever any transaction succeeds
  useEffect(() => {
    if (withdrawStatus === "success" || redeemStatus === "success" || depositStatus === "success") {
      void refetchAfterDelay();
    }
  }, [withdrawStatus, redeemStatus, depositStatus, refetchAfterDelay]);

  if (!item) return null;

  const currencySuffix = ` ${item.depositCurrency}`;
  const yieldNote = withdrawYield ? RESTAKE_YIELD_TO_WALLET_NOTE : RESTAKE_YIELD_IN_PRINCIPAL_NOTE;
  const isPending = restaking || isWithdrawing || isRedeeming || isDepositing;
  const isSuccess = depositStatus === "success";
  const errorMessage = withdrawError ?? redeemError ?? depositError;

  const canSubmit =
    !isPending && !!targetVault && !!amount && Number(amount) > 0 && Number(principalAmount) > 0;

  function handleClose() {
    resetWithdraw();
    resetRedeem();
    resetDeposit();
    onOpenChange(false);
  }

  async function handleRestake() {
    if (!canSubmit || !item || !targetVault) return;
    setRestaking(true);
    try {
      // Step 1: Claim principal (PT) from source vault
      await withdraw();
      // Step 2: Claim yield (YT) from source vault (always, toggle only affects deposit amount)
      if (hasYield) await redeemYield();
      // Step 3: Wait for RPC to reflect new balance, then refresh so deposit hook sees updated funds
      await refetchAfterDelay();
      // Step 4: Deposit into target vault
      await deposit();
    } finally {
      setRestaking(false);
    }
  }

  const buttonLabel = isWithdrawing
    ? "Claiming principal…"
    : isRedeeming
      ? "Claiming yield…"
      : depositStatus === "approving"
        ? "Approving USDC…"
        : isDepositing
          ? "Depositing…"
          : "Restake";

  if (isSuccess) {
    return (
      <DrawerShell open={open} onOpenChange={onOpenChange}>
        <RequestResultForm
          title="Restake complete"
          status="success"
          description="Your deposit has been restaked in the new pool."
        />
        <Button variant="primary" size="action" onClick={handleClose}>
          Done
        </Button>
      </DrawerShell>
    );
  }

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <AppDrawerHeading
        variant="plain"
        title="Restake your deposit"
        description="Claim from your ended vault and deposit into the latest active pool."
      />

      {/* Source vault */}
      <div className="flex flex-col gap-3">
        <span className="text-main-darkPurple text-sm font-semibold leading-5">From pool</span>
        <InfoRow
          variant="inline"
          label="Pool:"
          value={
            <PoolHeader iconUrl={item.depositCurrencyIconUrl} name={item.queueName} emphasized />
          }
        />
        <div className="flex flex-col gap-1.5">
          <InfoRow
            variant="inline"
            label="Your deposit (PT):"
            value={`${item.yourDeposit}${currencySuffix}`}
          />
          <InfoRow
            variant="inline"
            label="Yield generated (YT):"
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

      {/* Target vault */}
      {targetVault ? (
        <div className="flex flex-col gap-3">
          <span className="text-main-darkPurple text-sm font-semibold leading-5">Into pool</span>
          <InfoRow
            variant="inline"
            label="Pool:"
            value={
              <PoolHeader
                iconUrl={targetVault.depositCurrencyIconUrl}
                name={targetVault.queueName}
                emphasized
              />
            }
          />
          <div className="flex flex-col gap-1.5">
            <InfoRow
              variant="inline"
              label="Deposits:"
              value={`${targetVault.depositsAmount} ${targetVault.depositCurrency}`}
            />
            <InfoRow
              variant="inline"
              label="Liquidity:"
              value={`${targetVault.liquidityAmount} ${targetVault.depositCurrency}`}
            />
            <InfoRow variant="inline" label="Yield APY:" value={`${targetVault.yieldApyPercent}%`} />
            <InfoRow variant="inline" label="Pool lifetime:" value={targetVault.poolLifetime} />
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-xs px-1">No active pool available to restake into.</p>
      )}

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <span className="text-main-darkPurple text-sm font-semibold leading-5">Deposit amount</span>
        <InputWithMax
          value={amount}
          onChange={setAmount}
          maxValue={suggestedAmount}
          disabled={isPending}
        />
        {amount && Number(amount) > 0 && targetVault && (
          <div className="flex flex-col gap-1 px-1 pt-1">
            <InfoRow label="Buy-in cost:" value={`${buyIn} ${item.depositCurrency}`} />
            <InfoRow label="Total cost:" value={`${totalCost} ${item.depositCurrency}`} />
          </div>
        )}
      </div>

      {/* Yield destination toggle */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-main-darkPurple text-sm font-normal leading-5">
            Withdraw yield (YT) to wallet
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

      {errorMessage && <p className="text-red-500 text-xs px-1">{errorMessage}</p>}

      <Button
        variant="primary"
        size="action"
        onClick={() => void handleRestake()}
        disabled={isPending || !canSubmit}
      >
        {buttonLabel}
      </Button>
    </DrawerShell>
  );
}
