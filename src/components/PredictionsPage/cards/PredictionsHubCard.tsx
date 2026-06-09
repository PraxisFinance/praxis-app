"use client";

import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";
import type { EsportsMatchDrawerSide } from "@/components/PredictionsPage/drawers";
import { CryptoPredictionHubCard } from "./CryptoPredictionHubCard";
import { PredictionsHubCardLink } from "./PredictionsHubCardLink";
import { EsportsMatchHubCard } from "./EsportsMatchHubCard";
import { FinanceEventHubCard } from "./FinanceEventHubCard";
import { PoliticsEventHubCard } from "./PoliticsEventHubCard";
import { RandomRewardHubCard } from "./RandomRewardHubCard";
import { SportMatchHubCard } from "./SportMatchHubCard";
import { TechEventHubCard } from "./TechEventHubCard";

interface PredictionsHubCardProps {
  item: PredictionsHubItem;
  onCryptoPickOutcome?: (outcomeId: string) => void;
  onEsportsPickTeam?: (side: EsportsMatchDrawerSide) => void;
}

function renderPredictionsHubCard(
  item: PredictionsHubItem,
  onCryptoPickOutcome?: (outcomeId: string) => void,
  onEsportsPickTeam?: (side: EsportsMatchDrawerSide) => void,
) {
  switch (item.kind) {
    case "crypto":
      return (
        <CryptoPredictionHubCard prediction={item.prediction} onPickOutcome={onCryptoPickOutcome} />
      );
    case "esports":
      return <EsportsMatchHubCard match={item.match} onPickTeam={onEsportsPickTeam} />;
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

/** Routes a hub feed item to the matching category card component. */
export function PredictionsHubCard({
  item,
  onCryptoPickOutcome,
  onEsportsPickTeam,
}: PredictionsHubCardProps) {
  return (
    <PredictionsHubCardLink item={item}>
      {renderPredictionsHubCard(item, onCryptoPickOutcome, onEsportsPickTeam)}
    </PredictionsHubCardLink>
  );
}
