"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  getCryptoPredictionEndLine,
  getCryptoPredictionStatusFooter,
} from "@/shared/utils/cryptoPredictionFormat";
import { TWO_POOL_NOT_DEFINED_STR } from "@/shared/constants/twoPoolSentinels";
import {
  getActiveFeeScheduleSide,
  getEntranceFeePercentForSide,
  getNetDepositPercentAfterFee,
} from "@/shared/utils/twoPool";
import { TwoPoolDrawer } from "@/components/CryptocurrencyPage/TwoPool/TwoPoolDrawer";
import { TwoPoolSplitBar } from "@/components/CryptocurrencyPage/TwoPool/TwoPoolSplitBar";

export interface TwoPoolPageProps {
  pool: TwoPool;
}

export function TwoPoolPage({ pool }: TwoPoolPageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<TwoPoolSide | null>(null);

  const endSubtitle = getCryptoPredictionEndLine(pool.endsAt);
  const statusLine = getCryptoPredictionStatusFooter(pool.status);
  const scheduleSide = getActiveFeeScheduleSide(pool);
  const stableFee = getEntranceFeePercentForSide(pool, "stable");
  const elevatedFee = getEntranceFeePercentForSide(pool, "elevated");
  const stableNetPct = getNetDepositPercentAfterFee(stableFee);
  const elevatedNetPct = getNetDepositPercentAfterFee(elevatedFee);
  const targetApy = pool.targetApyPercent;
  const predictedApy = pool.predictedApyPercent;

  const openJoin = (side: TwoPoolSide) => {
    setDrawerSide(side);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) setDrawerSide(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <PoolHeader iconUrl={pool.iconUrl} name={pool.title} subtitle={endSubtitle} emphasized />

        {pool.actualRateRaw !== TWO_POOL_NOT_DEFINED_STR && pool.actualRateRaw !== "0" ? (
          <p className="text-main-darkPurple/70 text-2xs font-mono leading-snug">
            Indexer <span className="font-semibold">actualRate</span> (raw, units not mapped to UI
            APY%): {pool.actualRateRaw}
          </p>
        ) : null}

        <p className="text-main-darkPurple/80 text-2xs font-medium">
          <span className="bg-main-purple/15 text-main-purple mr-1.5 inline-block rounded-[5px] px-1.5 py-0.5 font-semibold">
            Two-Pool
          </span>
          Yield split uses deploy-time target APY. Entrance fees are a percent of your deposit (you
          receive fewer shares).
        </p>

        <TwoPoolSplitBar
          stablePoolPercent={pool.stablePoolPercent}
          elevatedPoolPercent={pool.elevatedPoolPercent}
          statusLine={statusLine}
        />

        <SectionHeader className="text-main-darkPurple text-base">Terms</SectionHeader>
        <ul className="text-main-darkPurple/85 list-inside list-disc space-y-1.5 text-sm leading-snug">
          <li>
            At period end, if realized yield is below target, the stable side receives a larger
            share of yield; if above target, elevated receives more.
          </li>
          <li>
            Your breakeven vs others depends on pool mix and realized yield; the UI shows fees and
            splits, not a single guaranteed personal breakeven.
          </li>
        </ul>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-md border border-main-grayPurple/60 p-3">
            <p className="text-main-darkPurple text-sm font-semibold">Stable</p>
            <InfoRow label="Entrance fee" value={`${stableFee}% of deposit`} />
            <InfoRow label="Shares from deposit" value={`~${stableNetPct.toFixed(2)}%`} />
            <Button
              variant="success"
              size="action"
              disabled={!pool.isTradingOpen}
              onClick={() => openJoin("stable")}
            >
              Join Stable
            </Button>
          </div>
          <div className="flex flex-col gap-2 rounded-md border border-main-grayPurple/60 p-3">
            <p className="text-main-darkPurple text-sm font-semibold">Elevated</p>
            <InfoRow label="Entrance fee" value={`${elevatedFee}% of deposit`} />
            <InfoRow label="Shares from deposit" value={`~${elevatedNetPct.toFixed(2)}%`} />
            <Button
              variant="destructiveMuted"
              size="action"
              disabled={!pool.isTradingOpen}
              onClick={() => openJoin("elevated")}
            >
              Join Elevated
            </Button>
          </div>
        </div>

        <p className="text-main-darkPurple/65 text-2xs leading-snug">
          Joining applies the fee for the side you pick: Stable {stableFee}% · Elevated{" "}
          {elevatedFee}% of deposit. Fee row highlight reflects predicted vs target, not which
          button you press.
        </p>
      </Card>

      <TwoPoolDrawer
        pool={pool}
        initialSide={drawerSide}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </div>
  );
}
