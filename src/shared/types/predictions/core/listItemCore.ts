import type { PredictionStatus } from "./status";

/** Discriminant for hub list routing — flat union across all card kinds. */
export type PredictionListItemType =
  | "politics"
  | "finance"
  | "tech"
  | "sport"
  | "esports"
  | "crypto_up_down"
  | "crypto_above_below"
  | "crypto_price_range"
  | "crypto_hit"
  | "random_reward";

/** Minimal shared fields for any predictions hub list item. */
export type PredictionCoreListItem = {
  id: string;
  predictionType: PredictionListItemType;
  status: PredictionStatus;
  /** ISO 8601 — start / «Starts at …» */
  startsAt?: string;
  /** ISO 8601 — close / «Ends in …» */
  endsAt?: string;
};

/** Crypto market variant without the `crypto_` hub prefix. */
export type CryptoMarketType = "up_down" | "above_below" | "price_range" | "hit";

const CRYPTO_LIST_ITEM_TYPE_TO_MARKET: Record<
  Extract<
    PredictionListItemType,
    "crypto_up_down" | "crypto_above_below" | "crypto_price_range" | "crypto_hit"
  >,
  CryptoMarketType
> = {
  crypto_up_down: "up_down",
  crypto_above_below: "above_below",
  crypto_price_range: "price_range",
  crypto_hit: "hit",
};

const CRYPTO_MARKET_TO_LIST_ITEM_TYPE: Record<CryptoMarketType, PredictionListItemType> = {
  up_down: "crypto_up_down",
  above_below: "crypto_above_below",
  price_range: "crypto_price_range",
  hit: "crypto_hit",
};

export function getCryptoMarketType(
  predictionType: Extract<
    PredictionListItemType,
    "crypto_up_down" | "crypto_above_below" | "crypto_price_range" | "crypto_hit"
  >,
): CryptoMarketType {
  return CRYPTO_LIST_ITEM_TYPE_TO_MARKET[predictionType];
}

export function toCryptoListItemType(marketType: CryptoMarketType): PredictionListItemType {
  return CRYPTO_MARKET_TO_LIST_ITEM_TYPE[marketType];
}

export function isCryptoListItemType(
  predictionType: PredictionListItemType,
): predictionType is Extract<
  PredictionListItemType,
  "crypto_up_down" | "crypto_above_below" | "crypto_price_range" | "crypto_hit"
> {
  return predictionType.startsWith("crypto_");
}
