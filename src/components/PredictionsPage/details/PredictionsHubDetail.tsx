"use client";

import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";
import {
  getPredictionsHubItemKind,
  isCryptoPredictionCard,
  isEsportsPredictionCard,
  isFinancePredictionCard,
  isPoliticsPredictionCard,
  isRandomRewardsPredictionCard,
  isRandomRewardsLiveCard,
  isRandomRewardsEndedCard,
  isSportPredictionCard,
  isTechPredictionCard,
} from "@/shared/types/predictions";
import {
  usePredictionsHubCryptoDrawer,
  usePredictionsHubEsportsDrawer,
  usePredictionsHubRandomRewardClaimDrawer,
  usePredictionsHubRandomRewardJoinDrawer,
  usePredictionsHubPoliticsDrawer,
  usePredictionsHubFinanceDrawer,
  usePredictionsHubTechDrawer,
  usePredictionsHubSportDrawer,
} from "@/components/PredictionsPage/drawers";
import { CryptoPredictionHubDetail } from "./crypto/CryptoPredictionHubDetail";
import { EsportsMatchHubDetail } from "./esports/EsportsMatchHubDetail";
import { FinanceEventHubDetail } from "./finance/FinanceEventHubDetail";
import { PoliticsEventHubDetail } from "./politics/PoliticsEventHubDetail";
import { RandomRewardHubDetail } from "./random-rewards/RandomRewardHubDetail";
import { PredictionsHubDetailUnavailable } from "./shared";
import { SportMatchHubDetail } from "./sport/SportMatchHubDetail";
import { TechEventHubDetail } from "./tech/TechEventHubDetail";

interface PredictionsHubDetailProps {
  item: PredictionsHubItem;
}

/** Routes a hub item to the matching category detail component. */
export function PredictionsHubDetail({ item }: PredictionsHubDetailProps) {
  const openCryptoDrawer = usePredictionsHubCryptoDrawer();
  const openEsportsDrawer = usePredictionsHubEsportsDrawer();
  const openRandomRewardJoinDrawer = usePredictionsHubRandomRewardJoinDrawer();
  const openRandomRewardClaimDrawer = usePredictionsHubRandomRewardClaimDrawer();
  const openSportDrawer = usePredictionsHubSportDrawer();
  const openPoliticsDrawer = usePredictionsHubPoliticsDrawer();
  const openFinanceDrawer = usePredictionsHubFinanceDrawer();
  const openTechDrawer = usePredictionsHubTechDrawer();

  switch (getPredictionsHubItemKind(item)) {
    case "crypto":
      if (isCryptoPredictionCard(item)) {
        return (
          <CryptoPredictionHubDetail
            prediction={item}
            onPickOutcome={(outcomeId) => openCryptoDrawer(item, outcomeId)}
          />
        );
      }
      break;
    case "esports":
      if (isEsportsPredictionCard(item)) {
        return (
          <EsportsMatchHubDetail
            match={item}
            onPickTeam={(side) => openEsportsDrawer(item, side)}
          />
        );
      }
      break;
    case "random-reward":
      if (isRandomRewardsPredictionCard(item)) {
        return (
          <RandomRewardHubDetail
            pool={item}
            onJoin={() => {
              if (isRandomRewardsLiveCard(item)) {
                openRandomRewardJoinDrawer(item);
              }
            }}
            onClaim={() => {
              if (isRandomRewardsEndedCard(item) && item.userWon) {
                openRandomRewardClaimDrawer(item);
              }
            }}
          />
        );
      }
      break;
    case "sport":
      if (isSportPredictionCard(item)) {
        return (
          <SportMatchHubDetail
            match={item}
            onPickTeam={(side) => openSportDrawer(item, side)}
          />
        );
      }
      break;
    case "politics":
      if (isPoliticsPredictionCard(item)) {
        return (
          <PoliticsEventHubDetail
            event={item}
            onPickOutcome={(outcomeId) => openPoliticsDrawer(item, outcomeId)}
          />
        );
      }
      break;
    case "finance":
      if (isFinancePredictionCard(item)) {
        return (
          <FinanceEventHubDetail
            event={item}
            onPickOutcome={(outcomeId) => openFinanceDrawer(item, outcomeId)}
          />
        );
      }
      break;
    case "tech":
      if (isTechPredictionCard(item)) {
        return (
          <TechEventHubDetail
            event={item}
            onPickOutcome={(outcomeId) => openTechDrawer(item, outcomeId)}
          />
        );
      }
      break;
  }

  return <PredictionsHubDetailUnavailable />;
}
