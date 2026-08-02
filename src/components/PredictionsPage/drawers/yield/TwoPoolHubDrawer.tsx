"use client";

import { useEffect, useState } from "react";
import { TwoPoolHubCardIcon } from "@/components/PredictionsPage/cards/yield/TwoPoolHubCardIcon";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { Switch } from "@/components/ui/Switch";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";
import { useTwoPool } from "@/hooks/useTwoPool";
import { formatTwoPoolSideLabel } from "@/shared/utils/twoPoolFormat";
import { parseTokenAmount } from "@/shared/utils/format";
import { TOKEN_DECIMALS } from "@/config/tokens";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  PredictionsDrawerAmountInput,
  usePredictionsDrawerMaxBalance,
} from "../shared";
import { TwoPoolExpectedPerformanceTable } from "./TwoPoolExpectedPerformanceTable";

const STATUS_LABELS: Record<string, string> = {
  approving: "Approving…",
  depositing: "Depositing…",
};

function isOnChainPoolId(id: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(id);
}

function formatPercentLabel(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}%`;
}

export interface TwoPoolHubDrawerProps {
  pool: TwoPool | null;
  side: TwoPoolSide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoPoolHubDrawer({ pool, side, open, onOpenChange }: TwoPoolHubDrawerProps) {
  if (!pool || !side) {
    return (
      <DrawerShell open={false} onOpenChange={onOpenChange}>
        {null}
      </DrawerShell>
    );
  }

  return (
    <TwoPoolHubDrawerBody
      key={`${pool.id}-${side}`}
      pool={pool}
      initialSide={side}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}

interface TwoPoolHubDrawerBodyProps {
  pool: TwoPool;
  initialSide: TwoPoolSide;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TwoPoolHubDrawerBody({
  pool,
  initialSide,
  open,
  onOpenChange,
}: TwoPoolHubDrawerBodyProps) {
  const [selectedSide, setSelectedSide] = useState<TwoPoolSide>(initialSide);
  const [amount, setAmount] = useState(pool.detail?.depositAmountInput ?? "");
  const [demoSuccess, setDemoSuccess] = useState(false);

  const detail = pool.detail;
  const onChain = isOnChainPoolId(pool.id);

  const { maxBalance, ytBalance } = usePredictionsDrawerMaxBalance();

  const { deposit, depositStatus, depositError, resetDeposit, isDepositPending } = useTwoPool(
    pool,
    selectedSide,
    amount
  );

  useEffect(() => {
    if (!open) return;
    setSelectedSide(initialSide);
    setAmount(pool.detail?.depositAmountInput ?? "");
    setDemoSuccess(false);
    resetDeposit();
  }, [open, initialSide, pool.detail?.depositAmountInput, resetDeposit]);

  const sideLabel = formatTwoPoolSideLabel(selectedSide);
  const isSuccess = depositStatus === "success" || demoSuccess;
  const isPending = isDepositPending;

  const amountValue = parseTokenAmount(amount, TOKEN_DECIMALS.USDC);
  const hasAmount = amountValue > BigInt(0);
  const insufficientBalance = onChain && amountValue > ytBalance;
  const canDeposit =
    pool.isTradingOpen &&
    !isPending &&
    !!detail &&
    !isSuccess &&
    hasAmount &&
    !insufficientBalance;

  function handleToggleSide(next: TwoPoolSide, checked: boolean) {
    if (!checked) return;
    setSelectedSide(next);
    resetDeposit();
    setDemoSuccess(false);
  }

  function handleClose() {
    resetDeposit();
    setDemoSuccess(false);
    onOpenChange(false);
  }

  async function handleDeposit() {
    if (!detail || !canDeposit) return;
    if (!onChain) {
      setDemoSuccess(true);
      return;
    }
    await deposit();
  }

  const buttonLabel = isPending
    ? (STATUS_LABELS[depositStatus] ?? "Depositing…")
    : isSuccess
      ? "Done"
      : "Deposit";

  return (
    <>
      <RequestResultDialog
        open={depositStatus === "error"}
        onClose={resetDeposit}
        title="Deposit Failed"
        description={depositError ?? "Something went wrong. Please try again."}
      />

      <RequestResultDialog
        open={isSuccess}
        onClose={handleClose}
        status="success"
        title="Deposit Successful"
        description="Your yield prediction deposit has been placed."
        closeLabel="Done"
      />

      <DrawerShell
        open={open}
        onOpenChange={onOpenChange}
        header={
          <AppDrawerHeading
            title={`${pool.title}: ${sideLabel}`}
            description="Predict your future yield"
          />
        }
        footer={
          isSuccess ? (
            <Button variant="primary" size="action" className="h-12 text-white" onClick={handleClose}>
              {buttonLabel}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="action"
              className="h-12 text-white"
              disabled={!canDeposit}
              onClick={() => void handleDeposit()}
            >
              {buttonLabel}
            </Button>
          )
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <InfoRow
              variant="inline"
              label="Pool Information:"
              value={
                <span className="inline-flex items-center gap-2">
                  <TwoPoolHubCardIcon size="sm" />
                  <span className="text-main-darkPurple text-sm font-semibold leading-5">
                    {detail?.underlyingPoolName ?? pool.title}
                  </span>
                </span>
              }
            />

            <div className="flex flex-col gap-1.5">
              <InfoRow
                variant="inline"
                label="Your deposit(YT):"
                value={detail?.yourDepositYtLabel ?? "—"}
              />
              <InfoRow
                variant="inline"
                label="Average yield(YT):"
                value={detail?.averageYieldYtLabel ?? "—"}
              />
              <InfoRow
                variant="inline"
                label="Slippage:"
                value={detail ? `${detail.slippagePercent}%` : "—"}
              />
              <InfoRow
                variant="inline"
                label="Pool lifetime:"
                value={detail?.poolLifetimeLabel ?? "—"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-main-darkPurple text-sm font-medium leading-5">
              Deposit amount:
            </span>
            <PredictionsDrawerAmountInput
              value={amount}
              onChange={setAmount}
              maxValue={maxBalance}
              placeholder="Deposit amount"
              disabled={isPending || isSuccess}
            />
            {insufficientBalance ? (
              <p className="text-main-red text-xs leading-snug" role="alert">
                Insufficient YT balance.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-main-darkPurple text-sm font-normal leading-5">Stable</span>
              <Switch
                checked={selectedSide === "stable"}
                onCheckedChange={(checked) => handleToggleSide("stable", checked)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-main-darkPurple text-sm font-normal leading-5">Elevated</span>
              <Switch
                checked={selectedSide === "elevated"}
                onCheckedChange={(checked) => handleToggleSide("elevated", checked)}
              />
            </div>
          </div>

          <div className="border-main-grayPurple/60 border-t pt-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-main-darkPurple text-sm font-medium leading-5">
                Expected performance:
              </span>
              <span className="text-main-darkPurple text-sm font-medium leading-5">
                Target APY {detail ? formatPercentLabel(detail.performanceTargetApyPercent) : "—"}
              </span>
            </div>

            {detail ? (
              <TwoPoolExpectedPerformanceTable
                realApyPercents={detail.performanceRealApyPercents}
                receivePercents={detail.performanceReceivePercents}
              />
            ) : null}
          </div>
        </div>
      </DrawerShell>
    </>
  );
}
