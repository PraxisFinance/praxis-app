"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type { RandomPoolLive } from "@/shared/types/randomPool";

interface RandomPoolJoinDrawerProps {
  pool: RandomPoolLive | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RandomPoolJoinDrawer({ pool, open, onOpenChange }: RandomPoolJoinDrawerProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (open && pool) setAmount("");
  }, [open, pool?.id]);

  if (!pool) return null;

  const walletBalance = DEFAULT_BALANCES[0]?.value ?? "0.000";

  return (
    <DrawerShell open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-6">
        <Drawer.Title className="text-main-darkPurple text-2xl leading-tight decoration-main-darkPurple underline-offset-4">
          Make a prediction
        </Drawer.Title>

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
            maxValue={walletBalance}
            placeholder="Deposit amount"
          />
        </div>

        <Button variant="primary" size="action">
          Place deposit
        </Button>
      </div>
    </DrawerShell>
  );
}
