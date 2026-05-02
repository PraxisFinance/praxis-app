import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { EarnAvailableItem } from "@/shared/types/earn";

interface EarnAvailableCardProps {
  item: EarnAvailableItem;
  onDeposit: (item: EarnAvailableItem) => void;
}

export function EarnAvailableCard({ item, onDeposit }: EarnAvailableCardProps) {
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
          label="Deposits"
          value={`${item.depositsAmount} ${item.depositCurrency}`}
        />
        <InfoRow
          variant="stacked"
          label="Liquidity"
          value={`${item.liquidityAmount} ${item.depositCurrency}`}
        />
        <InfoRow variant="stacked" label="Yield APY" value={`${item.yieldApyPercent}%`} />
      </div>

      <Button variant="success" size="action" onClick={() => onDeposit(item)}>
        Deposit
      </Button>
    </Card>
  );
}
