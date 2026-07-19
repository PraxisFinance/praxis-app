import Image from "next/image";
import { UsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PoolHeader } from "@/components/ui/PoolHeader";
import { cn } from "@/lib/utils";
import { isUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
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
  if (isYtIconUrl(iconUrl)) {
    return (
      <span className="inline-flex shrink-0" aria-hidden>
        <YtTokenIcon size={16} className="rounded-full" />
      </span>
    );
  }
  return (
    <Image src={iconUrl} alt={currency} width={16} height={16} className="h-4 w-4 rounded-full" />
  );
}

function StatBlock({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-2xs font-normal uppercase tracking-wide text-main-darkPurple">
        {label}
      </span>
      <div className="text-sm font-semibold text-main-darkPurple">{children}</div>
    </div>
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

      <div className="flex w-full items-start gap-3">
        <div className="flex min-w-0 flex-[2] flex-col gap-2">
          <p className="min-w-0 leading-4">
            <span className="text-2xs font-normal uppercase tracking-wide text-main-darkPurple">
              Liquidity:{" "}
            </span>
            <span className="text-2xs text-main-darkPurple break-words">
              {item.liquidityAmount} {item.depositCurrency}
            </span>
          </p>
          <p className="min-w-0 leading-4">
            <span className="text-2xs font-normal uppercase tracking-wide text-main-darkPurple">
              Deposits:{" "}
            </span>
            <span className="text-2xs text-main-darkPurple break-words">
              {item.depositsAmount} {item.depositCurrency}
            </span>
          </p>
        </div>

        <StatBlock label="Your deposite" className="min-w-0 flex-1 shrink">
          <span className="inline-flex items-center gap-1">
            {item.yourDeposit}
            <DepositCurrencyIcon
              iconUrl={item.depositCurrencyIconUrl}
              currency={item.depositCurrency}
            />
          </span>
        </StatBlock>

        <StatBlock label="Yield APY" className="min-w-0 flex-1 shrink">
          {item.yieldApyPercent}%
        </StatBlock>

        <StatBlock label="Stake date" className="min-w-0 flex-1 shrink">
          {item.stakeDate}
        </StatBlock>
      </div>

      <div className="flex w-full gap-3">
        {isEnded ? (
          <>
            <div className="min-w-0 flex-1">
              <Button
                variant="success"
                size="action"
                className="w-full"
                onClick={() => onClaim(item)}
              >
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
