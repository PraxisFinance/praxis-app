import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import type { CryptoPrediction } from "@/shared/types/cryptoPrediction";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import type { RandomPool } from "@/shared/types/randomPool";
import type { FinanceHubEvent } from "@/shared/types/financeHubEvent";
import type { PoliticsHubEvent } from "@/shared/types/politicsHubEvent";
import type { SportHubMatch } from "@/shared/types/sportHubMatch";
import type { TwoPool } from "@/shared/types/twoPool";

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

export function getPredictionsHubItemKey(item: PredictionsHubItem): string {
  switch (item.kind) {
    case "crypto":
      return `crypto:${item.prediction.id}`;
    case "esports":
      return `esports:${item.match.id}`;
    case "random-reward":
      return `random-reward:${item.pool.id}`;
    case "sport":
      return `sport:${item.match.id}`;
    case "politics":
      return `politics:${item.event.id}`;
    case "finance":
      return `finance:${item.event.id}`;
    case "tech":
      return `tech:${item.event.id}`;
  }
}

export function isPredictionsHubItemKind(
  item: PredictionsHubItem,
  kind: PredictionsHubItemKind
): boolean {
  return item.kind === kind;
}
