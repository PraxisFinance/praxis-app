export type EarnPositionStatus = "active" | "ended";

export interface EarnPosition {
  vaultAddress: `0x${string}`;
  queueName: string;
  poolLifetime: string;
  depositCurrency: string;
  depositCurrencyIcon: string;
  depositCurrencyIconUrl: string;
  yourDeposit: string;
  yieldApyPercent: string;
  yieldGenerated: string;
  stakeTime: string;
  stakeDate: string;
  status: EarnPositionStatus;
}

export interface EarnAvailableItem {
  vaultAddress: `0x${string}`;
  queueName: string;
  poolLifetime: string;
  depositCurrency: string;
  depositCurrencyIcon: string;
  depositCurrencyIconUrl: string;

  depositsAmount: string;
  liquidityAmount: string;

  yieldApyPercent: string;
  ytPayoutTime: string;
}
