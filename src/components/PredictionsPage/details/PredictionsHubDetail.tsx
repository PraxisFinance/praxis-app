"use client";

import type { PredictionsHubItem } from "@/shared/types/predictionsHubItem";
import {
  usePredictionsHubCryptoDrawer,
  usePredictionsHubEsportsDrawer,
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
      return <RandomRewardHubDetail pool={item.pool} />;
    case "sport":
      return <SportMatchHubDetail match={item.match} />;
    case "politics":
      return <PoliticsEventHubDetail event={item.event} />;
    case "finance":
      return <FinanceEventHubDetail event={item.event} />;
    case "tech":
      return <TechEventHubDetail event={item.event} />;
  }
}
