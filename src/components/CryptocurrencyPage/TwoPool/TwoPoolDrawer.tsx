"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppDrawerHeading } from "@/components/ui/AppDrawerHeading";
import { DrawerShell } from "@/components/ui/DrawerShell";
import { InfoRow } from "@/components/ui/InfoRow";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  getActiveFeeScheduleSide,
  getEntranceFeePercentForSide,
  getNetDepositPercentAfterFee,
} from "@/shared/utils/twoPool";
import { TWO_POOL_NOT_DEFINED_STR } from "@/shared/constants/twoPoolSentinels";

const PREDICTION_MAX_BALANCE =
  DEFAULT_BALANCES.find((b) => b.iconUrl === "/icons/yt-token.png")?.value ??
  DEFAULT_BALANCES[0]?.value ??
  "0";

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
        />
      ) : null}
    </DrawerShell>
  );
}

function TwoPoolDrawerBody({ pool, initialSide }: { pool: TwoPool; initialSide: TwoPoolSide }) {
  const [side, setSide] = useState<TwoPoolSide>(initialSide);
  const [amount, setAmount] = useState("");
  const isAvailable = pool.isTradingOpen;
  const feePct = getEntranceFeePercentForSide(pool, side);
  const netPct = getNetDepositPercentAfterFee(feePct);
  const scheduleSide = getActiveFeeScheduleSide(pool);
  const targetApy = pool.targetApyPercent;
  const predictedApy = pool.predictedApyPercent;

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
        maxValue={PREDICTION_MAX_BALANCE}
        placeholder="Deposit amount"
        disabled={!isAvailable}
      />

      <Button variant="primary" size="action" disabled={!isAvailable}>
        Join pool
      </Button>
    </div>
  );
}
