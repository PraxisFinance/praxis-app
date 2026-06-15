import type { PredictionsHubCategoryId } from "@/shared/constants/predictionsHubFilters";
import { getEsportsGameLabel } from "@/shared/constants/esports";
import { getSportDisciplineLabel } from "@/shared/constants/predictionsHubFilters";

export type {
  EsportsMatch,
  EsportsPredictionCard,
  FinanceHubEvent,
  FinancePredictionCard,
  PoliticsHubEvent,
  PoliticsPredictionCard,
  PredictionsHubItem,
  PredictionsHubItemKind,
  PredictionsHubListItem,
  SportHubMatch,
  SportPredictionCard,
  TechHubEvent,
  TechPredictionCard,
} from "./predictions";

export {
  PREDICTIONS_HUB_ITEMS_BY_CATEGORY,
  PREDICTIONS_HUB_KIND_TO_CATEGORY,
  getPredictionsHubItemEndsAt,
  getPredictionsHubItemId,
  getPredictionsHubItemKey,
  getPredictionsHubItemKind,
  isPredictionsHubItemKind,
  predictionsHubItemHasKind,
} from "./predictions";

import type { PredictionsHubListItem } from "./predictions";

export function getPredictionsHubDetailBreadcrumb(item: PredictionsHubListItem): string | undefined {
  switch (item.predictionType) {
    case "esports":
      return `Esports • ${getEsportsGameLabel(item.gameId)}`;
    case "random_reward":
      return "Random pools";
    case "sport":
      return `Sports • ${getSportDisciplineLabel(item.disciplineId)}`;
    case "politics":
      return "Politics";
    case "finance":
      return "Finance";
    case "tech":
      return "Tech";
    default:
      return undefined;
  }
}
