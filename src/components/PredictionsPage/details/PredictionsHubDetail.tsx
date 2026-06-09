"use client";

import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";
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

  switch (item.kind) {
    case "crypto":
      return (
        <CryptoPredictionHubDetail
          prediction={item.prediction}
          onPickOutcome={(outcomeId) => openCryptoDrawer(item.prediction, outcomeId)}
        />
      );
    case "esports":
      return (
        <EsportsMatchHubDetail
          match={item.match}
          onPickTeam={(side) => openEsportsDrawer(item.match, side)}
        />
      );
    case "random-reward":
      return (
        <RandomRewardHubDetail
          pool={item.pool}
          onJoin={() => {
            if (item.pool.status === "live") {
              openRandomRewardJoinDrawer(item.pool);
            }
          }}
          onClaim={() => {
            if (item.pool.status === "ended" && item.pool.userWon) {
              openRandomRewardClaimDrawer(item.pool);
            }
          }}
        />
      );
    case "sport":
      return (
        <SportMatchHubDetail
          match={item.match}
          onPickTeam={(side) => openSportDrawer(item.match, side)}
        />
      );
    case "politics":
      return (
        <PoliticsEventHubDetail
          event={item.event}
          onPickOutcome={(outcomeId) => openPoliticsDrawer(item.event, outcomeId)}
        />
      );
    case "finance":
      return (
        <FinanceEventHubDetail
          event={item.event}
          onPickOutcome={(outcomeId) => openFinanceDrawer(item.event, outcomeId)}
        />
      );
    case "tech":
      return (
        <TechEventHubDetail
          event={item.event}
          onPickOutcome={(outcomeId) => openTechDrawer(item.event, outcomeId)}
        />
      );
  }
}
