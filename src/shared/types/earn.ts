export type EarnPositionStatus = "active" | "ended";

export interface EarnPosition {
  vaultAddress: `0x${string}`;
  queueName: string;
  poolLifetime: string;
  depositCurrency: string;
  depositCurrencyIcon: string;
  depositCurrencyIconUrl: string;
  liquidityAmount: string;
  depositsAmount: string;
  yourDeposit: string;
  yieldApyPercent: string;
  yieldGenerated: string;
  stakeTime: string;
  stakeDate: string;
  /** Drawer display, e.g. "19:00 21 Sept 2026" */
  depositTime: string;
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
