"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { useRYDClaim } from "@/hooks/useRYD";
import type { RandomPoolEnded } from "@/shared/types/randomPool";
import { RequestResultDialog } from "@/components/ui/RequestResultDialog";

const STATUS_LABELS: Record<string, string> = {
  claiming: "Claiming…",
};

export interface RandomRewardClaimDrawerProps {
  pool: RandomPoolEnded | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RandomRewardClaimDrawer({
  pool,
  open,
  onOpenChange,
}: RandomRewardClaimDrawerProps) {
  const rydAddress = (pool?.id ?? "0x0") as `0x${string}`;
  const { claim, status, errorMessage, reset, isPending } = useRYDClaim(rydAddress);

  useEffect(() => {
    if (open && pool) {
      reset();
    }
  }, [open, pool?.id, pool, reset]);

  if (!pool) return null;

  function handleSuccessClose() {
    reset();
    onOpenChange(false);
  }

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
        onClose={handleSuccessClose}
        status="success"
        title="Claim Successful"
        description="Your rewards have been claimed to your wallet."
        closeLabel="Done"
      />

      <DrawerShell
        open={open}
        onOpenChange={onOpenChange}
        header={
          <AppDrawerHeading
            title="Claim rewards"
            titleClassName="underline decoration-main-darkPurple underline-offset-4"
          />
        }
        footer={
          <Button
            variant="primary"
            size="action"
            className="h-12 text-white"
            disabled={isPending}
            onClick={claim}
          >
            {STATUS_LABELS[status] ?? "Claim rewards"}
          </Button>
        }
      >
        <div className="flex flex-col gap-6">

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
        </div>
      </DrawerShell>
    </>
  );
}
