import type { PredictionCoreListItem } from "../core/listItemCore";
import type { CryptoBinaryOutcomes } from "../core/participant";
import type { CryptoPredictionDetail } from "../details/cryptoDetail";

export type CryptoStrikeLevel = {
  id: string;
  targetLabel: string;
  yes: { odds?: number; poolPercent?: number };
  no: { odds?: number; poolPercent?: number };
};

/** @deprecated Use `CryptoStrikeLevel`. */
export type CryptoStrikeBinary = CryptoStrikeLevel;

type PredictionCryptoCardBase = PredictionCoreListItem & {
  title: string;
  assetSymbol: string;
  iconUrl: string;
  isTradingOpen: boolean;
  volumeLabel?: string;
  description?: string | null;
  categories?: string[];
  cpfPoolId: bigint;
  cpfAddress: `0x${string}`;
  detail?: CryptoPredictionDetail;
  /** @deprecated Use `detail`. */
  hubDetail?: CryptoPredictionDetail;
  /** @deprecated Use `detail`. */
  upDownDetail?: CryptoPredictionDetail;
};

export type PredictionCryptoUpDownCard = PredictionCryptoCardBase & {
  predictionType: "crypto_up_down";
  outcomes: CryptoBinaryOutcomes;
};

export type PredictionCryptoPriceRangeCard = PredictionCryptoCardBase & {
  predictionType: "crypto_price_range";
  lowerBoundLabel: string;
  upperBoundLabel: string;
  outcomes: CryptoBinaryOutcomes;
};

export type PredictionCryptoHitCard = PredictionCryptoCardBase & {
  predictionType: "crypto_hit";
  targetPriceLabel: string;
  outcomes: CryptoBinaryOutcomes;
};

export type PredictionCryptoAboveBelowCard = PredictionCryptoCardBase & {
  predictionType: "crypto_above_below";
  strikes: CryptoStrikeLevel[];
};

export type PredictionCryptoCard =
  | PredictionCryptoUpDownCard
  | PredictionCryptoPriceRangeCard
  | PredictionCryptoHitCard
  | PredictionCryptoAboveBelowCard;

/** @deprecated Use `PredictionCryptoCard`. */
export type CryptoPrediction = PredictionCryptoCard;

/** @deprecated Use `PredictionCryptoUpDownCard`. */
export type CryptoPredictionUpDown = PredictionCryptoUpDownCard;

/** @deprecated Use `PredictionCryptoAboveBelowCard`. */
export type CryptoPredictionAboveBelow = PredictionCryptoAboveBelowCard;

/** @deprecated Use `PredictionCryptoPriceRangeCard`. */
export type CryptoPredictionPriceRange = PredictionCryptoPriceRangeCard;

/** @deprecated Use `PredictionCryptoHitCard`. */
export type CryptoPredictionHit = PredictionCryptoHitCard;
