"use client";

import { useState } from "react";
import type { RandomPool } from "@/shared/types/randomPool";
import { isRandomRewardsEndedCard, isRandomRewardsLiveCard } from "@/shared/types/predictions";
import { RandomRewardDetailEndedSection } from "./RandomRewardDetailEndedSection";
import { RandomRewardDetailJoinSection } from "./RandomRewardDetailJoinSection";
import { RandomRewardDetailPoolInfo } from "./RandomRewardDetailPoolInfo";
import { RandomRewardsPoolPartitiantList } from "./RandomRewardsPoolPartitiantList";

interface RandomRewardHubDetailProps {
  pool: RandomPool;
  onJoin?: () => void;
  onClaim?: () => void;
}

export function RandomRewardHubDetail({ pool, onJoin, onClaim }: RandomRewardHubDetailProps) {
  const [amount, setAmount] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <RandomRewardDetailPoolInfo pool={pool} />

      {isRandomRewardsLiveCard(pool) ? (
        <RandomRewardDetailJoinSection
          amount={amount}
          onAmountChange={setAmount}
          walletBalance="0"
          onJoin={onJoin}
        />
      ) : isRandomRewardsEndedCard(pool) ? (
        <RandomRewardDetailEndedSection pool={pool} onClaim={onClaim} />
      ) : null}
    </div>
  );
}
