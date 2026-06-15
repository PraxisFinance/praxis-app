"use client";

import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";
import {
  getPredictionsHubItemKind,
  isCryptoPredictionCard,
  isEsportsPredictionCard,
  isFinancePredictionCard,
  isPoliticsPredictionCard,
  isRandomRewardsPredictionCard,
  isSportPredictionCard,
  isTechPredictionCard,
} from "@/shared/types/predictions";
import type { EsportsMatchDrawerSide, SportMatchDrawerSide } from "@/components/PredictionsPage/drawers";
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
  onRandomRewardJoin?: () => void;
  onRandomRewardClaim?: () => void;
  onSportPickTeam?: (side: SportMatchDrawerSide) => void;
  onPoliticsPickOutcome?: (outcomeId: string) => void;
  onFinancePickOutcome?: (outcomeId: string) => void;
  onTechPickOutcome?: (outcomeId: string) => void;
}

function renderPredictionsHubCard(
  item: PredictionsHubItem,
  onCryptoPickOutcome?: (outcomeId: string) => void,
  onEsportsPickTeam?: (side: EsportsMatchDrawerSide) => void,
  onRandomRewardJoin?: () => void,
  onRandomRewardClaim?: () => void,
  onSportPickTeam?: (side: SportMatchDrawerSide) => void,
  onPoliticsPickOutcome?: (outcomeId: string) => void,
  onFinancePickOutcome?: (outcomeId: string) => void,
  onTechPickOutcome?: (outcomeId: string) => void,
) {
  switch (getPredictionsHubItemKind(item)) {
    case "crypto":
      return isCryptoPredictionCard(item) ? (
        <CryptoPredictionHubCard prediction={item} onPickOutcome={onCryptoPickOutcome} />
      ) : null;
    case "esports":
      return isEsportsPredictionCard(item) ? (
        <EsportsMatchHubCard match={item} onPickTeam={onEsportsPickTeam} />
      ) : null;
    case "random-reward":
      return isRandomRewardsPredictionCard(item) ? (
        <RandomRewardHubCard
          pool={item}
          onJoin={onRandomRewardJoin}
          onClaim={onRandomRewardClaim}
        />
      ) : null;
    case "sport":
      return isSportPredictionCard(item) ? (
        <SportMatchHubCard match={item} onPickTeam={onSportPickTeam} />
      ) : null;
    case "politics":
      return isPoliticsPredictionCard(item) ? (
        <PoliticsEventHubCard event={item} onPickOutcome={onPoliticsPickOutcome} />
      ) : null;
    case "finance":
      return isFinancePredictionCard(item) ? (
        <FinanceEventHubCard event={item} onPickOutcome={onFinancePickOutcome} />
      ) : null;
    case "tech":
      return isTechPredictionCard(item) ? (
        <TechEventHubCard event={item} onPickOutcome={onTechPickOutcome} />
      ) : null;
  }
}

/** Routes a hub feed item to the matching category card component. */
export function PredictionsHubCard({
  item,
  onCryptoPickOutcome,
  onEsportsPickTeam,
  onRandomRewardJoin,
  onRandomRewardClaim,
  onSportPickTeam,
  onPoliticsPickOutcome,
  onFinancePickOutcome,
  onTechPickOutcome,
}: PredictionsHubCardProps) {
  return (
    <PredictionsHubCardLink item={item}>
      {renderPredictionsHubCard(
        item,
        onCryptoPickOutcome,
        onEsportsPickTeam,
        onRandomRewardJoin,
        onRandomRewardClaim,
        onSportPickTeam,
        onPoliticsPickOutcome,
        onFinancePickOutcome,
        onTechPickOutcome,
      )}
    </PredictionsHubCardLink>
  );
}
