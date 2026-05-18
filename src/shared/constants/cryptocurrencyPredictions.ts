export const CRYPTO_PREDICTION_TIME_FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "1h", label: "1h" },
  { id: "6h", label: "6h" },
  { id: "12h", label: "12h" },
  { id: "1d", label: "1d" },
  { id: "2d", label: "2d" },
  { id: "1w", label: "1w" },
] as const;

export type CryptoPredictionTimeFilterId = (typeof CRYPTO_PREDICTION_TIME_FILTERS)[number]["id"];

export const CRYPTO_PREDICTION_TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "two_pool", label: "Two-Pool" },
  { id: "up_down", label: "Up/Down" },
  { id: "above_below", label: "Above/Below" },
  { id: "price_range", label: "Price Range" },
  { id: "hit", label: "Hit price" },
] as const;

export type CryptoPredictionTypeFilterId = (typeof CRYPTO_PREDICTION_TYPE_FILTERS)[number]["id"];
