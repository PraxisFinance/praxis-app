"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { getBalanceValueByIconUrl } from "@/shared/constants/balances";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  getActiveFeeScheduleSide,
  getEntranceFeePercentForSide,
  getNetDepositPercentAfterFee,
} from "@/shared/utils/twoPool";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useTwoPoolDeposit } from "@/hooks/useTwoPoolDeposit";
import { useTwoPoolsStore } from "@/stores/twoPoolsStore";

export interface TwoPoolDrawerProps {
  pool: TwoPool | null;
  initialSide: TwoPoolSide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TwoPoolDrawer({ pool, initialSide, open, onOpenChange }: TwoPoolDrawerProps) {
  return (
    <DrawerShell open={open && pool != null && initialSide != null} onOpenChange={onOpenChange}>
      {pool && initialSide ? (
        <TwoPoolDrawerBody
          key={`${pool.id}-${initialSide}`}
          pool={pool}
          initialSide={initialSide}
          onRequestClose={() => onOpenChange(false)}
        />
      ) : null}
    </DrawerShell>
  );
}

function TwoPoolDrawerBody({
  pool,
  initialSide,
  onRequestClose,
}: {
  pool: TwoPool;
  initialSide: TwoPoolSide;
  onRequestClose: () => void;
}) {
  const [side, setSide] = useState<TwoPoolSide>(initialSide);
  const [amount, setAmount] = useState("");
  const { balances, refetch: refetchBalances } = useWalletBalances();
  const fetchTwoPools = useTwoPoolsStore((s) => s.fetchPools);
  const { deposit, status, errorMessage, reset, isPending } = useTwoPoolDeposit(pool, side, amount);

  useEffect(() => {
    if (status === "success") {
      void refetchBalances();
      void fetchTwoPools();
    }
  }, [status, refetchBalances, fetchTwoPools]);

  const isAvailable = pool.isTradingOpen;
  const feePct = getEntranceFeePercentForSide(pool, side);
  const netPct = getNetDepositPercentAfterFee(feePct);
  const scheduleSide = getActiveFeeScheduleSide(pool);
  const targetApy = pool.targetApyPercent;
  const predictedApy = pool.predictedApyPercent;
  const walletUsdc = getBalanceValueByIconUrl(balances, "/icons/usdc.png");

  const buttonLabel =
    status === "approving"
      ? "Approving USDC…"
      : status === "depositing"
        ? "Depositing…"
        : status === "success"
          ? "Done"
          : "Join pool";

  const amountPositive = amount.length > 0 && Number(amount) > 0;

  const handleDone = () => {
    reset();
    setAmount("");
    onRequestClose();
  };

  return (
    <div className="flex flex-col gap-3">
      <AppDrawerHeading title="Join Two-Pool" />

      <div className="flex flex-col gap-2 rounded-sm bg-main-grayPurple/80 px-4 py-3">
        <p className="text-main-darkPurple text-sm leading-tight font-medium">{pool.title}</p>
        <p className="text-main-darkPurple/70 text-2xs leading-snug">
          Target {targetApy}% APY · Predicted {predictedApy}% APY · Fee schedule:{" "}
          {scheduleSide === "elevated" ? "Elevated" : "Stable"} (predicted{" "}
          {predictedApy > targetApy ? ">" : "≤"} target)
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={side === "stable" ? "success" : "secondaryBrand"}
          size="action"
          className="min-h-12 flex-1"
          disabled={!isAvailable}
          onClick={() => setSide("stable")}
        >
          Stable
        </Button>
        <Button
          type="button"
          variant={side === "elevated" ? "destructiveMuted" : "secondaryBrand"}
          size="action"
          className="min-h-12 flex-1"
          disabled={!isAvailable}
          onClick={() => setSide("elevated")}
        >
          Elevated
        </Button>
      </div>

      <div className="flex flex-col gap-2 rounded-sm border border-main-grayPurple/50 px-3 py-2">
        <InfoRow label="Entrance fee" value={`${feePct}% of deposit`} />
        <InfoRow
          label="Shares vs deposit"
          value={`~${netPct.toFixed(2)}% of deposit becomes shares`}
        />
      </div>

      {!isAvailable && (
        <p className="text-center text-sm leading-5 text-main-darkPurple/80">
          Deposits are closed for this pool.
        </p>
      )}

      <InputWithMax
        value={amount}
        onChange={setAmount}
        maxValue={walletUsdc}
        placeholder="Deposit amount"
        disabled={!isAvailable || isPending}
      />

      <p className="text-main-darkPurple/80 text-2xs px-0.5">
        Available: {walletUsdc} USDC
      </p>

      {errorMessage ? (
        <p className="text-main-red text-xs leading-snug px-0.5" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {status === "success" ? (
        <Button variant="success" size="action" onClick={handleDone}>
          {buttonLabel}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="action"
          disabled={!isAvailable || isPending || !amountPositive}
          onClick={() => void deposit()}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
