"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import { useRYDDeposit } from "@/hooks/useRYD";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { formatTokenBalance } from "@/shared/utils/format";
import { TOKEN_DECIMALS } from "@/config/tokens";
import type { RandomPoolLive } from "@/shared/types/randomPool";

const STATUS_LABELS: Record<string, string> = {
  approving: "Approving…",
  depositing: "Depositing…",
};

interface RandomPoolJoinDrawerProps {
  pool: RandomPoolLive | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RandomPoolJoinDrawer({ pool, open, onOpenChange }: RandomPoolJoinDrawerProps) {
  const [amount, setAmount] = useState("");
  const { raw, refetch } = useWalletBalances();

  const rydAddress = (pool?.id ?? "0x0") as `0x${string}`;

  const { deposit, status, errorMessage, reset, isPending, insufficientBalance } =
    useRYDDeposit(rydAddress, amount, raw.yt);

  useEffect(() => {
    if (open && pool) {
      setAmount("");
      reset();
    }
  }, [open, pool?.id]);

  useEffect(() => {
    if (status === "success") {
      refetch();
      onOpenChange(false);
    }
  }, [status]);

  if (!pool) return null;

  const ytBalanceFormatted = formatTokenBalance(raw.yt, TOKEN_DECIMALS.YT);
  const canDeposit = !!pool && !isPending && !insufficientBalance && amount !== "";

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-6">
        <AppDrawerHeading
          title="Make a prediction"
          titleClassName="underline decoration-main-darkPurple underline-offset-4"
        />

        <div className="rounded-2xl bg-main-grayPurple/80 px-4 py-3">
          <p className="text-main-darkPurple mb-2 text-base font-bold leading-5">{pool.title}</p>
          <div className="text-main-darkPurple/90 mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-tight">
            <span>TVL: {pool.tvl}</span>
            <span>Expected yield: {pool.expectedYield}</span>
            <span>Users in: {pool.usersIn}</span>
          </div>
          <p className="text-main-darkPurple/85 text-xs leading-tight">
            {formatRandomPoolRemainingTime(pool.remainingTime)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <InputWithMax
            value={amount}
            onChange={setAmount}
            maxValue={ytBalanceFormatted}
            placeholder="Deposit amount"
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}

        <Button
          variant="primary"
          size="action"
          disabled={!canDeposit}
          onClick={deposit}
        >
          {STATUS_LABELS[status] ?? "Place deposit"}
        </Button>
      </div>
    </DrawerShell>
  );
}
