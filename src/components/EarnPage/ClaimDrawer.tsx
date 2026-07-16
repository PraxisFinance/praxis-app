"use client";

import { useEffect, useState } from "react";
import { AlertIcon } from "@/components/icons/base/alertIcon";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { Switch } from "@/components/ui/Switch";
import { CLAIM_PT_YT_NOTE } from "@/shared/constants/earn";
import type { EarnPosition } from "@/shared/types/earn";
import { useVaultClaimBoth } from "@/hooks/useVault";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";

interface ClaimDrawerProps {
  item: EarnPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPoolLifetimeDisplay(lifetime: string): string {
  if (lifetime === "Ended") return lifetime;
  return lifetime.replace(/ \d+s$/, "");
}

export function ClaimDrawer({ item, open, onOpenChange }: ClaimDrawerProps) {
  const [withdrawPrincipal, setWithdrawPrincipal] = useState(true);
  const [withdrawYield, setWithdrawYield] = useState(true);

  const vaultAddress = item?.vaultAddress ?? "0x0";
  const principalAmount = item?.yourDeposit ?? "";
  const yieldAmount = item?.yieldGenerated ?? "";

  const { refetchAfterDelay } = useWalletBalances();
  const { claim, status, errorMessage, reset, isPending } = useVaultClaimBoth(
    vaultAddress,
    principalAmount,
    yieldAmount
  );

  const isSuccess = status === "success";

  const principalPositive = Number(principalAmount) > 0;
  const yieldPositive = Number(yieldAmount) > 0;
  // Align with useVaultClaimBoth: zero-amount legs are skipped, not blockers.
  const canClaimPrincipal = withdrawPrincipal && principalPositive;
  const canClaimYield = withdrawYield && yieldPositive;
  const canSubmit = canClaimPrincipal || canClaimYield;

  useEffect(() => {
    if (isSuccess) void refetchAfterDelay();
  }, [isSuccess, refetchAfterDelay]);

  if (!item) return null;

  const currencySuffix = ` ${item.depositCurrency}`;

  function resetDrawerState() {
    setWithdrawPrincipal(true);
    setWithdrawYield(true);
    reset();
  }

  function handleTogglePrincipal(checked: boolean) {
    setWithdrawPrincipal(checked);
    reset();
  }

  function handleToggleYield(checked: boolean) {
    setWithdrawYield(checked);
    reset();
  }

  function handleClose() {
    resetDrawerState();
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetDrawerState();
    onOpenChange(nextOpen);
  }

  async function handleClaim() {
    if (!canSubmit) return;
    await claim({ principal: canClaimPrincipal, yield: canClaimYield });
  }

  const buttonLabel = isPending ? "Claiming…" : isSuccess ? "Done" : "Claim Funds";

  return (
    <>
      <RequestResultDialog
        open={status === "error"}
        onClose={reset}
        title="Claim Failed"
        description={errorMessage ?? "Something went wrong. Please try again."}
      />

      <RequestResultDialog
        open={status === "success"}
        onClose={handleClose}
        status="success"
        title="Claim Successful"
        description="Your funds have been claimed to your wallet."
        closeLabel="Done"
      />

      <DrawerShell
        open={open}
        onOpenChange={handleOpenChange}
        header={
          <AppDrawerHeading
            variant="plain"
            title="Claim your deposit from ended vault"
            description="Withdraw your cryptocurrency from ended pool."
          />
        }
        footer={
          isSuccess ? (
            <Button variant="success" size="action" onClick={handleClose}>
              {buttonLabel}
            </Button>
          ) : (
            <Button
              variant="success"
              size="action"
              onClick={() => void handleClaim()}
              disabled={isPending || !canSubmit}
            >
              {buttonLabel}
            </Button>
          )
        }
      >

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
              Withdraw principal(PT)
            </span>
            <Switch
              checked={canClaimPrincipal}
              onCheckedChange={handleTogglePrincipal}
              disabled={!principalPositive}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-main-darkPurple text-sm font-normal leading-5">
              Withdraw yield(YT)
            </span>
            <Switch
              checked={canClaimYield}
              onCheckedChange={handleToggleYield}
              disabled={!yieldPositive}
            />
          </div>

          <div className="flex items-start gap-2">
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-main-grayPurple"
              aria-hidden
            >
              <AlertIcon className="h-3 w-3" />
            </span>
            <p className="text-main-darkPurple/70 text-xs font-normal leading-4">
              {CLAIM_PT_YT_NOTE}
            </p>
          </div>
        </div>
      </DrawerShell>
    </>
  );
}
