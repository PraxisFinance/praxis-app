import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import type { PredictionCoreListItem, PredictionListItemType } from "./core/listItemCore";
import { isCryptoListItemType } from "./core/listItemCore";
import type { PredictionCryptoCard } from "./cards/cryptoCard";
import type { EsportsPredictionCard } from "./domains/esports";
import type { FinancePredictionCard } from "./domains/finance";
import type { PoliticsPredictionCard } from "./domains/politics";
import type {
  PredictionRandomRewardsEndedCard,
  PredictionRandomRewardsLiveCard,
} from "./cards/randomRewardsCard";
import type { RandomRewardsPredictionCard } from "./domains/randomRewards";
import type { SportPredictionCard } from "./domains/sport";
import type { TechPredictionCard } from "./domains/tech";

export type PredictionsHubListItem =
  | PoliticsPredictionCard
  | FinancePredictionCard
  | TechPredictionCard
  | SportPredictionCard
  | EsportsPredictionCard
  | PredictionCryptoCard
  | RandomRewardsPredictionCard;

/** @deprecated Use `PredictionsHubListItem`. */
export type PredictionsHubItem = PredictionsHubListItem;

/** Legacy hub category discriminator derived from `predictionType`. */
export type PredictionsHubItemKind =
  | "crypto"
  | "esports"
  | "random-reward"
  | "sport"
  | "politics"
  | "finance"
  | "tech";

export function getPredictionsHubItemKind(item: PredictionsHubListItem): PredictionsHubItemKind {
  switch (item.predictionType) {
    case "politics":
      return "politics";
    case "finance":
      return "finance";
    case "tech":
      return "tech";
    case "sport":
      return "sport";
    case "esports":
      return "esports";
    case "random_reward":
      return "random-reward";
    default:
      return "crypto";
  }
}

export function getPredictionsHubItemId(item: PredictionsHubListItem): string {
  return item.id;
}

export function getPredictionsHubItemKey(item: PredictionsHubListItem): string {
  return `${item.predictionType}:${item.id}`;
}

export function getPredictionsHubItemEndsAt(item: PredictionsHubListItem): string | undefined {
  return item.endsAt;
}

export function predictionsHubItemHasKind(
  item: PredictionsHubListItem,
  kind: PredictionsHubItemKind,
): boolean {
  return getPredictionsHubItemKind(item) === kind;
}

export function isPredictionsHubItemKind(value: string): value is PredictionsHubItemKind {
  return (
    value === "crypto" ||
    value === "esports" ||
    value === "random-reward" ||
    value === "sport" ||
    value === "politics" ||
    value === "finance" ||
    value === "tech"
  );
}

export function predictionTypeMatchesHubCategory(
  predictionType: PredictionListItemType,
  categoryId: PredictionsHubCategoryId,
): boolean {
  const kind = predictionTypeToHubKind(predictionType);
  return PREDICTIONS_HUB_ITEMS_BY_CATEGORY[categoryId].includes(kind);
}

function predictionTypeToHubKind(predictionType: PredictionListItemType): PredictionsHubItemKind {
  if (isCryptoListItemType(predictionType)) return "crypto";
  if (predictionType === "random_reward") return "random-reward";
  return predictionType;
}

/** Which card kinds are valid for each hub category filter. */
export const PREDICTIONS_HUB_ITEMS_BY_CATEGORY: Record<
  PredictionsHubCategoryId,
  readonly PredictionsHubItemKind[]
> = {
  all: ["crypto", "esports", "random-reward", "sport", "politics", "finance", "tech"],
  crypto: ["crypto"],
  esports: ["esports"],
  "random-rewards": ["random-reward"],
  sport: ["sport"],
  politics: ["politics"],
  finance: ["finance"],
  tech: ["tech"],
};

/** Hub category filter for each feed card kind (used on detail screens). */
export const PREDICTIONS_HUB_KIND_TO_CATEGORY: Record<
  PredictionsHubItemKind,
  PredictionsHubCategoryId
> = {
  crypto: "crypto",
  esports: "esports",
  "random-reward": "random-rewards",
  sport: "sport",
  politics: "politics",
  finance: "finance",
  tech: "tech",
};

export type PredictionsHubViewModel<
  TCard extends PredictionCoreListItem = PredictionsHubListItem,
  TDetail = unknown,
> = {
  card: TCard;
  detail?: TDetail;
};

export function isPoliticsPredictionCard(
  item: PredictionsHubListItem,
): item is PoliticsPredictionCard {
  return item.predictionType === "politics";
}

export function isFinancePredictionCard(
  item: PredictionsHubListItem,
): item is FinancePredictionCard {
  return item.predictionType === "finance";
}

export function isTechPredictionCard(item: PredictionsHubListItem): item is TechPredictionCard {
  return item.predictionType === "tech";
}

export function isSportPredictionCard(item: PredictionsHubListItem): item is SportPredictionCard {
  return item.predictionType === "sport";
}

export function isEsportsPredictionCard(
  item: PredictionsHubListItem,
): item is EsportsPredictionCard {
  return item.predictionType === "esports";
}

export function isCryptoPredictionCard(
  item: PredictionsHubListItem,
): item is PredictionCryptoCard {
  return isCryptoListItemType(item.predictionType);
}

export function isRandomRewardsPredictionCard(
  item: PredictionsHubListItem,
): item is RandomRewardsPredictionCard {
  return item.predictionType === "random_reward";
}

export function isRandomRewardsLiveCard(
  item: RandomRewardsPredictionCard,
): item is PredictionRandomRewardsLiveCard {
  return item.status.kind === "live";
}

export function isRandomRewardsEndedCard(
  item: RandomRewardsPredictionCard,
): item is PredictionRandomRewardsEndedCard {
  return item.status.kind === "ended";
}
