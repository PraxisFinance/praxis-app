"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { useRYDClaim } from "@/hooks/useRYD";
import type { RandomPoolEnded } from "@/shared/types/randomPool";

const STATUS_LABELS: Record<string, string> = {
  claiming: "Claiming…",
};

export interface RandomRewardClaimDrawerProps {
  pool: RandomPoolEnded | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RandomRewardClaimDrawer({ pool, open, onOpenChange }: RandomRewardClaimDrawerProps) {
  const rydAddress = (pool?.id ?? "0x0") as `0x${string}`;
  const { claim, status, errorMessage, reset, isPending } = useRYDClaim(rydAddress);

  useEffect(() => {
    if (open && pool) {
      reset();
    }
  }, [open, pool?.id, pool, reset]);

  useEffect(() => {
    if (status === "success") {
      onOpenChange(false);
    }
  }, [status, onOpenChange]);

  if (!pool) return null;

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-6">
        <AppDrawerHeading
          title="Claim rewards"
          titleClassName="underline decoration-main-darkPurple underline-offset-4"
        />

        <div className="rounded-2xl bg-main-grayPurple/80 px-4 py-3">
          <p className="text-main-darkPurple mb-2 text-base font-bold leading-5">{pool.title}</p>
          <div className="text-main-darkPurple/90 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-tight">
            <span>TVL: {pool.tvl}</span>
            <span>Earnings: {pool.earnings}</span>
            <span>Users won: {pool.usersWon}</span>
          </div>
        </div>

        <p className="text-main-darkPurple text-sm leading-snug">
          Congratulations! You are among the winners — claim your rewards to your wallet.
        </p>

        {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}

        <Button
          variant="primary"
          size="action"
          className="h-8 text-white"
          disabled={isPending}
          onClick={claim}
        >
          {STATUS_LABELS[status] ?? "Claim rewards"}
        </Button>
      </div>
    </DrawerShell>
  );
}
