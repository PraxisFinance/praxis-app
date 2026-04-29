"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { InfoRow } from "@/components/ui/InfoRow";
import { cn } from "@/lib/utils";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  getCryptoPredictionEndLine,
  getCryptoPredictionStatusFooter,
} from "@/shared/utils/cryptoPredictionFormat";
import { getActiveFeeScheduleSide, getEntranceFeePercentForSide } from "@/shared/utils/twoPool";
import { CryptoPredictionCardHeader } from "../CryptocurrencyPredictionCard/CryptoPredictionCardHeader";
import { TwoPoolIndexerNotes } from "./TwoPoolIndexerNotes";
import { TwoPoolSplitBar } from "./TwoPoolSplitBar";

export interface TwoPoolCardProps {
  pool: TwoPool;
  onJoin: (pool: TwoPool, side: TwoPoolSide) => void;
}

export function TwoPoolCard({ pool, onJoin }: TwoPoolCardProps) {
  const endLine = getCryptoPredictionEndLine(pool.endsAt);
  const statusLine = getCryptoPredictionStatusFooter(pool.status);
  const scheduleSide = getActiveFeeScheduleSide(pool);
  const stableFee = getEntranceFeePercentForSide(pool, "stable");
  const elevatedFee = getEntranceFeePercentForSide(pool, "elevated");

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <CryptoPredictionCardHeader iconUrl={pool.iconUrl} title={pool.title} endLine={endLine} />

      <p className="text-main-darkPurple/80 text-2xs font-medium">
        <span className="bg-main-purple/15 text-main-purple mr-1.5 inline-block rounded-[5px] px-1.5 py-0.5 font-semibold">
          Two-Pool
        </span>
        Target {pool.targetApyPercent}% APY · Predicted {pool.predictedApyPercent}% · Fee row:{" "}
        {scheduleSide === "elevated" ? "Elevated" : "Stable"}
      </p>

      <p className="text-main-darkPurple/70 text-2xs font-mono leading-snug">
        actualRate (raw): {pool.actualRateRaw}
      </p>

      <TwoPoolSplitBar
        stablePoolPercent={pool.stablePoolPercent}
        elevatedPoolPercent={pool.elevatedPoolPercent}
        statusLine={statusLine}
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-sm bg-main-grayPurple/40 px-2 py-1.5">
          <InfoRow variant="stacked" label="Stable fee" value={`${stableFee}% of deposit`} />
        </div>
        <div className="rounded-sm bg-main-grayPurple/40 px-2 py-1.5">
          <InfoRow variant="stacked" label="Elevated fee" value={`${elevatedFee}% of deposit`} />
        </div>
      </div>

      <p className="text-main-darkPurple/65 text-2xs leading-snug">
        Fee reduces shares you receive — when indexed, shown as % of deposit (pool-level fees are not
        on <span className="font-mono">TwoPoolState</span>).
      </p>

      <TwoPoolIndexerNotes pool={pool} />

      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="h-12 min-w-0 flex-1">
            <Button
              type="button"
              variant="success"
              size="action"
              className="h-full w-full text-main"
              disabled={!pool.isTradingOpen}
              onClick={() => onJoin(pool, "stable")}
            >
              Join Stable
            </Button>
          </div>
          <div className="h-12 min-w-0 flex-1">
            <Button
              type="button"
              variant="destructiveMuted"
              size="action"
              className="h-full w-full text-main"
              disabled={!pool.isTradingOpen}
              onClick={() => onJoin(pool, "elevated")}
            >
              Join Elevated
            </Button>
          </div>
        </div>

        <Link
          href={`/predictions/cryptocurrency/twopools/${pool.id}`}
          className={cn(
            buttonVariants({ variant: "secondaryBrand", size: "action" }),
            "inline-flex w-full items-center justify-center text-center"
          )}
        >
          Pool details
        </Link>
      </div>
    </article>
  );
}
