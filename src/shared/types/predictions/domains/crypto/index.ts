export type {
  CryptoPrediction,
  CryptoPredictionAboveBelow,
  CryptoPredictionHit,
  CryptoPredictionPriceRange,
  CryptoPredictionUpDown,
  CryptoStrikeBinary,
  CryptoStrikeLevel,
  PredictionCryptoAboveBelowCard,
  PredictionCryptoCard,
  PredictionCryptoHitCard,
  PredictionCryptoPriceRangeCard,
  PredictionCryptoUpDownCard,
} from "../../cards/cryptoCard";

export type { CryptoPredictionDetail } from "../../details/cryptoDetail";

/** @deprecated Use `CryptoPredictionDetail`. */
export type CryptoPredictionHubMarketDetail = import("../../details/cryptoDetail").CryptoPredictionDetail;
