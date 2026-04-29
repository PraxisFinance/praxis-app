import type { CryptoPredictionStatus } from "@/shared/types/cryptoPrediction";

export type TwoPoolSide = "stable" | "elevated";

/**
 * Two-pool yield product: stable vs elevated deposits; yield split vs deploy-time target APY;
 * entrance fee as % of deposit (fewer shares).
 */
export type TwoPool = {
  id: string;
  title: string;
  assetSymbol: string;
  iconUrl: string;
  status: CryptoPredictionStatus;
  endsAt: string;
  isTradingOpen: boolean;
  /** Deploy-time target APY % — yield split hinges on realized vs this target */
  targetApyPercent: number;
  /** Model / predicted future APY % — drives which entrance fee row applies */
  predictedApyPercent: number;
  /** Deposit share in stable pool (0–100) */
  stablePoolPercent: number;
  /** Deposit share in elevated pool (0–100) */
  elevatedPoolPercent: number;
  /** Entrance fee as % of deposit for stable side (fewer shares) */
  stableEntranceFeePercent: number;
  /** Entrance fee as % of deposit for elevated side */
  elevatedEntranceFeePercent: number;
};
