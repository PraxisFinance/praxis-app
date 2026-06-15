"use client";

import {
  getPredictionsHubItemKey,
  type PredictionsHubItem,
} from "@/shared/types/predictionsHubItem";
import {
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
import { PredictionsHubCard } from "./cards/PredictionsHubCard";

interface PredictionsHubItemsListProps {
  items: PredictionsHubItem[];
  emptyMessage?: string;
}

export function PredictionsHubItemsList({
  items,
  emptyMessage = "No predictions found.",
}: PredictionsHubItemsListProps) {
  const openCryptoDrawer = usePredictionsHubCryptoDrawer();
  const openEsportsDrawer = usePredictionsHubEsportsDrawer();
  const openRandomRewardJoinDrawer = usePredictionsHubRandomRewardJoinDrawer();
  const openRandomRewardClaimDrawer = usePredictionsHubRandomRewardClaimDrawer();
  const openSportDrawer = usePredictionsHubSportDrawer();
  const openPoliticsDrawer = usePredictionsHubPoliticsDrawer();
  const openFinanceDrawer = usePredictionsHubFinanceDrawer();
  const openTechDrawer = usePredictionsHubTechDrawer();

  if (items.length === 0) {
    return <p className="text-main-darkPurple/70 px-1 text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <PredictionsHubCard
          key={getPredictionsHubItemKey(item)}
          item={item}
          onCryptoPickOutcome={
            isCryptoPredictionCard(item)
              ? (outcomeId) => openCryptoDrawer(item, outcomeId)
              : undefined
          }
          onEsportsPickTeam={
            isEsportsPredictionCard(item)
              ? (side) => openEsportsDrawer(item, side)
              : undefined
          }
          onRandomRewardJoin={
            isRandomRewardsPredictionCard(item)
              ? () => {
                  if (isRandomRewardsLiveCard(item)) {
                    openRandomRewardJoinDrawer(item);
                  }
                }
              : undefined
          }
          onRandomRewardClaim={
            isRandomRewardsPredictionCard(item)
              ? () => {
                  if (isRandomRewardsEndedCard(item) && item.userWon) {
                    openRandomRewardClaimDrawer(item);
                  }
                }
              : undefined
          }
          onSportPickTeam={
            isSportPredictionCard(item) ? (side) => openSportDrawer(item, side) : undefined
          }
          onPoliticsPickOutcome={
            isPoliticsPredictionCard(item)
              ? (outcomeId) => openPoliticsDrawer(item, outcomeId)
              : undefined
          }
          onFinancePickOutcome={
            isFinancePredictionCard(item)
              ? (outcomeId) => openFinanceDrawer(item, outcomeId)
              : undefined
          }
          onTechPickOutcome={
            isTechPredictionCard(item) ? (outcomeId) => openTechDrawer(item, outcomeId) : undefined
          }
        />
      ))}
    </div>
  );
}
