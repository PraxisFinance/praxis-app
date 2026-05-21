import Image from "next/image";
import { UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import type { EarnPosition } from "@/shared/types/earn";

interface EarnMyPositionsCardProps {
  item: EarnPosition;
  onDeposit: (item: EarnPosition) => void;
  onWithdraw: (item: EarnPosition) => void;
  onClaim: (item: EarnPosition) => void;
  onRestake: (item: EarnPosition) => void;
}

function DepositCurrencyIcon({ iconUrl, currency }: { iconUrl: string; currency: string }) {
  if (isUsdcIconUrl(iconUrl)) {
    return (
      <span className="inline-flex shrink-0" aria-hidden>
        <UsdcTokenIcon size={16} className="rounded-full" />
      </span>
    );
  }
  if (isWUsdcIconUrl(iconUrl)) {
    return (
      <span className="inline-flex shrink-0" aria-hidden>
        <WUsdcTokenIcon size={16} className="rounded-full" />
      </span>
    );
  }
  if (isYtIconUrl(iconUrl)) {
    return (
      <span className="inline-flex shrink-0" aria-hidden>
        <YtTokenIcon size={16} className="rounded-full" />
      </span>
    );
  }
  return (
    <Image
      src={iconUrl}
      alt={currency}
      width={16}
      height={16}
      className="h-4 w-4 rounded-full"
    />
  );
}

export function EarnMyPositionsCard({
  item,
  onDeposit,
  onWithdraw,
  onClaim,
  onRestake,
}: EarnMyPositionsCardProps) {
  const isEnded = item.status === "ended";

  return (
    <Card>
      <PoolHeader
        iconUrl={item.depositCurrencyIconUrl}
        name={item.queueName}
        subtitle={`Pool lifetime: ${item.poolLifetime}`}
      />

      <div className="flex gap-6">
        <div className="flex flex-col gap-3">
          <InfoRow
            variant="stacked"
            label="Liquidity"
            value={`${item.liquidityAmount} ${item.depositCurrency}`}
          />
          <InfoRow
            variant="stacked"
            label="Deposits"
            value={`${item.depositsAmount} ${item.depositCurrency}`}
          />
        </div>
        <InfoRow
          variant="stacked"
          label="Your deposite"
          value={
            <div className="flex items-center gap-1">
              {item.yourDeposit}
              <DepositCurrencyIcon
                iconUrl={item.depositCurrencyIconUrl}
                currency={item.depositCurrency}
              />
            </div>
          }
        />
        <div className="flex flex-col gap-3">
          <InfoRow variant="stacked" label="Yield APY" value={`${item.yieldApyPercent}%`} />
          <InfoRow variant="stacked" label="Stake date" value={item.stakeDate} />
        </div>
      </div>

      <div className="flex w-full gap-3">
        {isEnded ? (
          <>
            <div className="min-w-0 flex-1">
              <Button variant="success" size="action" className="w-full" onClick={() => onClaim(item)}>
                Claim
              </Button>
            </div>
            <div className="min-w-0 flex-1">
              <Button
                variant="primary"
                size="action"
                className="w-full"
                onClick={() => onRestake(item)}
              >
                Restake
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <Button
                variant="success"
                size="action"
                className="w-full"
                onClick={() => onDeposit(item)}
              >
                Deposite
              </Button>
            </div>
            <div className="min-w-0 flex-1">
              <Button
                variant="destructiveBrand"
                size="action"
                className="w-full"
                onClick={() => onWithdraw(item)}
              >
                Withdraw
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
