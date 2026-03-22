import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnPosition } from "@/shared/types/earn";

interface EarnMyPositionsCardProps {
  item: EarnPosition;
  onWithdraw: (item: EarnPosition) => void;
  onClaim: (item: EarnPosition) => void;
}

export function EarnMyPositionsCard({ item, onWithdraw, onClaim }: EarnMyPositionsCardProps) {
  const isEnded = item.status === "ended";

  return (
    <Card>
      <PoolHeader
        iconUrl={item.depositCurrencyIconUrl}
        name={item.queueName}
        subtitle={`Pool lifetime: ${item.poolLifetime}`}
      />

      <div className="flex gap-6">
        <InfoRow
          variant="stacked"
          label="Your deposite"
          value={
            <div className="flex items-center gap-1">
              {item.yourDeposit}
              <Image
                src={item.depositCurrencyIconUrl}
                alt={item.depositCurrency}
                width={16}
                height={16}
                className="w-4 h-4 rounded-full"
              />
            </div>
          }
        />
        <InfoRow variant="stacked" label="Yield APY" value={`${item.yieldApyPercent}%`} />
        <InfoRow
          variant="stacked"
          label="Stake date"
          value={
            <div className="flex items-baseline gap-1.5">
              <span>{item.stakeTime}</span>
              <span className="text-2xs font-normal leading-3">{item.stakeDate}</span>
            </div>
          }
        />
      </div>

      <Button
        variant={isEnded ? "primary" : "destructiveBrand"}
        size="action"
        onClick={() => (isEnded ? onClaim(item) : onWithdraw(item))}
      >
        {isEnded ? "Claim deposite" : "Withdraw"}
      </Button>
    </Card>
  );
}
