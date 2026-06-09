"use client";

import {
  getPredictionsHubItemKey,
  type PredictionsHubItem,
} from "@/shared/types/predictionsHubItem";
import {
  usePredictionsHubCryptoDrawer,
  usePredictionsHubEsportsDrawer,
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
        />
      ))}
    </div>
  );
}
