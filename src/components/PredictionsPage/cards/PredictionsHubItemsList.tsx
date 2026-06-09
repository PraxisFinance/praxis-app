"use client";

import {
  getPredictionsHubItemKey,
  type PredictionsHubItem,
} from "@/shared/types/predictionsHubItem";
import {
  usePredictionsHubCryptoDrawer,
  usePredictionsHubEsportsDrawer,
  usePredictionsHubRandomRewardClaimDrawer,
  usePredictionsHubRandomRewardJoinDrawer,
} from "@/components/PredictionsPage/drawers";
import { PredictionsHubCard } from "./PredictionsHubCard";

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
            item.kind === "crypto"
              ? (outcomeId) => openCryptoDrawer(item.prediction, outcomeId)
              : undefined
          }
          onEsportsPickTeam={
            item.kind === "esports"
              ? (side) => openEsportsDrawer(item.match, side)
              : undefined
          }
          onRandomRewardJoin={
            item.kind === "random-reward"
              ? () => {
                  if (item.pool.status === "live") {
                    openRandomRewardJoinDrawer(item.pool);
                  }
                }
              : undefined
          }
          onRandomRewardClaim={
            item.kind === "random-reward"
              ? () => {
                  if (item.pool.status === "ended" && item.pool.userWon) {
                    openRandomRewardClaimDrawer(item.pool);
                  }
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
