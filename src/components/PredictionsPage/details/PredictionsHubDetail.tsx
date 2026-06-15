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
      return isCryptoPredictionCard(item) ? (
        <CryptoPredictionHubDetail
          prediction={item}
          onPickOutcome={(outcomeId) => openCryptoDrawer(item, outcomeId)}
        />
      ) : null;
    case "esports":
      return isEsportsPredictionCard(item) ? (
        <EsportsMatchHubDetail
          match={item}
          onPickTeam={(side) => openEsportsDrawer(item, side)}
        />
      ) : null;
    case "random-reward":
      return isRandomRewardsPredictionCard(item) ? (
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
      ) : null;
    case "sport":
      return isSportPredictionCard(item) ? (
        <SportMatchHubDetail
          match={item}
          onPickTeam={(side) => openSportDrawer(item, side)}
        />
      ) : null;
    case "politics":
      return isPoliticsPredictionCard(item) ? (
        <PoliticsEventHubDetail
          event={item}
          onPickOutcome={(outcomeId) => openPoliticsDrawer(item, outcomeId)}
        />
      ) : null;
    case "finance":
      return isFinancePredictionCard(item) ? (
        <FinanceEventHubDetail
          event={item}
          onPickOutcome={(outcomeId) => openFinanceDrawer(item, outcomeId)}
        />
      ) : null;
    case "tech":
      return isTechPredictionCard(item) ? (
        <TechEventHubDetail
          event={item}
          onPickOutcome={(outcomeId) => openTechDrawer(item, outcomeId)}
        />
      ) : null;
  }
}
