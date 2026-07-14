"use client";

import { Button } from "@/components/ui/button";
import { InfoRow } from "@/components/ui/InfoRow";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import {
  formatTwoPoolCurrentApy,
  formatTwoPoolPredictedApy,
  getTwoPoolEndLine,
  getTwoPoolProtocolLabel,
} from "@/shared/utils/twoPoolFormat";
import { stopHubCardLinkNavigation } from "../stopHubCardLinkNavigation";
import { TwoPoolHubCardHeader } from "./TwoPoolHubCardHeader";

export interface TwoPoolHubCardProps {
  pool: TwoPool;
  onPickSide?: (side: TwoPoolSide) => void;
}

export function TwoPoolHubCard({ pool, onPickSide }: TwoPoolHubCardProps) {
  const disabled = !pool.isTradingOpen;
  const endLine = getTwoPoolEndLine(pool.endsAt);
  const protocolLabel = getTwoPoolProtocolLabel(pool);

  return (
    <article className="bg-main-lightGray flex w-full flex-col gap-3 rounded-[10px] p-3">
      <TwoPoolHubCardHeader
        title={pool.title}
        protocolLabel={protocolLabel}
        endLine={endLine}
      />

      <div className="flex flex-col gap-1.5">
        <InfoRow label="Pool TVL:" value={pool.tvlLabel} />
        <InfoRow label="Current APY:" value={formatTwoPoolCurrentApy(pool)} />
        <InfoRow label="Predicted APY:" value={formatTwoPoolPredictedApy(pool)} />
      </div>

      <div className="flex gap-3">
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="primary"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onPickSide?.("stable");
            }}
          >
            Stable
          </Button>
        </div>
        <div className="h-8 min-w-0 flex-1">
          <Button
            type="button"
            variant="success"
            size="action"
            disabled={disabled}
            className="h-full text-white"
            onClick={(event) => {
              stopHubCardLinkNavigation(event);
              onPickSide?.("elevated");
            }}
          >
            Elevated
          </Button>
        </div>
      </div>
    </article>
  );
}
