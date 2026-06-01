import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";
import { CryptoPredictionHubCard } from "./CryptoPredictionHubCard";
import { EsportsMatchHubCard } from "./EsportsMatchHubCard";
import { FinanceEventHubCard } from "./FinanceEventHubCard";
import { PoliticsEventHubCard } from "./PoliticsEventHubCard";
import { RandomRewardHubCard } from "./RandomRewardHubCard";
import { SportMatchHubCard } from "./SportMatchHubCard";
import { TechEventHubCard } from "./TechEventHubCard";

interface PredictionsHubCardProps {
  item: PredictionsHubItem;
}

/** Routes a hub feed item to the matching category card component. */
export function PredictionsHubCard({ item }: PredictionsHubCardProps) {
  switch (item.kind) {
    case "crypto":
      return <CryptoPredictionHubCard prediction={item.prediction} />;
    case "esports":
      return <EsportsMatchHubCard match={item.match} />;
    case "random-reward":
      return <RandomRewardHubCard pool={item.pool} />;
    case "sport":
      return <SportMatchHubCard match={item.match} />;
    case "politics":
      return <PoliticsEventHubCard event={item.event} />;
    case "finance":
      return <FinanceEventHubCard event={item.event} />;
    case "tech":
      return <TechEventHubCard event={item.event} />;
  }
}
