import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import type { RandomPool } from "@/shared/types/randomPool";
import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
export type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
export type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
export type { SportHubMatch } from "@/shared/types/sportHubMatch";

/** Discriminator for hub feed cards — one value per card component. */
export type PredictionsHubItemKind =
  | "crypto"
  | "esports"
  | "random-reward"
  | "sport"
  | "politics"
  | "finance"
  | "tech";

export type TechHubEvent = {
  id: string;
  title: string;
  endsAt?: string;
};

export type PredictionsHubItem =
  | { kind: "crypto"; prediction: CryptoPrediction }
  | { kind: "esports"; match: EsportsMatch }
  | { kind: "random-reward"; pool: RandomPool }
  | { kind: "sport"; match: SportHubMatch }
  | { kind: "politics"; event: PoliticsHubEvent }
  | { kind: "finance"; event: FinanceHubEvent }
  | { kind: "tech"; event: TechHubEvent };

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

const PREDICTIONS_HUB_ITEM_KINDS = new Set<PredictionsHubItemKind>(
  Object.keys(PREDICTIONS_HUB_KIND_TO_CATEGORY) as PredictionsHubItemKind[],
);

export function isPredictionsHubItemKind(value: string): value is PredictionsHubItemKind {
  return PREDICTIONS_HUB_ITEM_KINDS.has(value as PredictionsHubItemKind);
}

export function getPredictionsHubItemId(item: PredictionsHubItem): string {
  switch (item.kind) {
    case "crypto":
      return item.prediction.id;
    case "esports":
      return item.match.id;
    case "random-reward":
      return item.pool.id;
    case "sport":
      return item.match.id;
    case "politics":
      return item.event.id;
    case "finance":
      return item.event.id;
    case "tech":
      return item.event.id;
  }
}

export function getPredictionsHubItemKey(item: PredictionsHubItem): string {
  return `${item.kind}:${getPredictionsHubItemId(item)}`;
}

export function predictionsHubItemHasKind(
  item: PredictionsHubItem,
  kind: PredictionsHubItemKind
): boolean {
  return item.kind === kind;
}
