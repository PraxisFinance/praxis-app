import {
  CRYPTO_PREDICTION_TIME_FILTERS,
  type CryptoPredictionTimeFilterId,
  type CryptoPredictionTypeFilterId,
} from "@/shared/constants/cryptocurrencyPredictions";
import { ESPORTS_GAMES, type EsportsGameFilterId } from "@/shared/constants/esports";

export const PREDICTIONS_HUB_CATEGORY_FILTERS = [
  { id: "all", label: "All", title: "All predictions" },
  { id: "crypto", label: "Crypto", title: "Cryptocurrencies" },
  { id: "esports", label: "Esports", title: "Matches" },
  { id: "random-rewards", label: "Random rewards", title: null },
  { id: "sport", label: "Sport", title: "Matches" },
  { id: "politics", label: "Politics", title: null },
  { id: "finance", label: "Finance", title: "Events" },
  { id: "tech", label: "Tech", title: "Events" },
] as const;

export type PredictionsHubCategoryId = (typeof PREDICTIONS_HUB_CATEGORY_FILTERS)[number]["id"];

export const PREDICTIONS_HUB_TIME_FILTERS = CRYPTO_PREDICTION_TIME_FILTERS;
export type PredictionsHubTimeFilterId = CryptoPredictionTimeFilterId;

export const PREDICTIONS_HUB_MARKET_TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "up_down", label: "Up/Down" },
  { id: "above_below", label: "Above/Below" },
  { id: "price_range", label: "Price Range" },
  { id: "hit", label: "Hit price" },
] as const;

export type PredictionsHubMarketTypeId = (typeof PREDICTIONS_HUB_MARKET_TYPE_FILTERS)[number]["id"];

export const PREDICTIONS_HUB_ESPORTS_GAMES = ESPORTS_GAMES.map((game) =>
  game.id === "csgo" ? { ...game, label: "CS2" } : game
);

export const PREDICTIONS_HUB_SPORT_DISCIPLINES = [
  { id: "football", label: "Football" },
  { id: "basketball", label: "Basketball" },
  { id: "hockey", label: "Hockey" },
  { id: "formula1", label: "Formula 1" },
] as const;

export type PredictionsHubSportDisciplineId =
  (typeof PREDICTIONS_HUB_SPORT_DISCIPLINES)[number]["id"];

export type PredictionsHubSubFilterKind = "market-type" | "esports-game" | "sport-discipline";

export function getPredictionsHubSubFilterKind(
  categoryId: PredictionsHubCategoryId
): PredictionsHubSubFilterKind | null {
  if (categoryId === "crypto" || categoryId === "finance") return "market-type";
  if (categoryId === "esports") return "esports-game";
  if (categoryId === "sport") return "sport-discipline";
  return null;
}

export interface PredictionsHubFilterState {
  categoryId: PredictionsHubCategoryId;
  timeId: PredictionsHubTimeFilterId;
  marketTypeId: PredictionsHubMarketTypeId;
  esportsGameId: EsportsGameFilterId | null;
  sportDisciplineId: PredictionsHubSportDisciplineId | null;
}

export const DEFAULT_PREDICTIONS_HUB_FILTER_STATE: PredictionsHubFilterState = {
  categoryId: "all",
  timeId: "all",
  marketTypeId: "all",
  esportsGameId: null,
  sportDisciplineId: null,
};

export function applyPredictionsHubCategoryChange(
  prev: PredictionsHubFilterState,
  categoryId: PredictionsHubCategoryId
): PredictionsHubFilterState {
  return {
    ...prev,
    categoryId,
    marketTypeId: "all",
    esportsGameId: null,
    sportDisciplineId: null,
  };
}

/** Initial hub filter state with a preset category (resets category-specific sub-filters). */
export function createPredictionsHubFilterState(
  categoryId: PredictionsHubCategoryId = "all",
): PredictionsHubFilterState {
  return applyPredictionsHubCategoryChange(DEFAULT_PREDICTIONS_HUB_FILTER_STATE, categoryId);
}

const PREDICTIONS_HUB_CATEGORY_IDS = new Set<PredictionsHubCategoryId>(
  PREDICTIONS_HUB_CATEGORY_FILTERS.map((category) => category.id),
);

export function isPredictionsHubCategoryId(value: string): value is PredictionsHubCategoryId {
  return PREDICTIONS_HUB_CATEGORY_IDS.has(value as PredictionsHubCategoryId);
}

export function hubMarketTypeToFeedType(
  id: PredictionsHubMarketTypeId
): CryptoPredictionTypeFilterId {
  return id;
}

export function hubCategoryShowsCryptoFeed(categoryId: PredictionsHubCategoryId): boolean {
  return categoryId === "all" || categoryId === "crypto" || categoryId === "finance";
}
