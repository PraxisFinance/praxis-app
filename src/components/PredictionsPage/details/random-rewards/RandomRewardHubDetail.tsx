"use client";

import { useState } from "react";
import { RandomPoolParticipantList } from "@/components/RandomRewardsPage/RandomPoolParticipantList";
import type { RandomPool } from "@/shared/types/randomPool";
import { RandomRewardDetailEndedSection } from "./RandomRewardDetailEndedSection";
import { RandomRewardDetailJoinSection } from "./RandomRewardDetailJoinSection";
import { RandomRewardDetailPoolInfo } from "./RandomRewardDetailPoolInfo";

interface RandomRewardHubDetailProps {
  pool: RandomPool;
  onJoin?: () => void;
  onClaim?: () => void;
}

export function RandomRewardHubDetail({ pool, onJoin, onClaim }: RandomRewardHubDetailProps) {
  const [amount, setAmount] = useState("");
  const participants = pool.hubDetail?.participants ?? [];
  const winners = pool.hubDetail?.winners ?? [];
  const walletBalance = pool.hubDetail?.walletBalance ?? "0";

  return (
    <div className="flex flex-col gap-4">
      <RandomRewardDetailPoolInfo pool={pool} />

      {pool.status === "live" ? (
        <>
          <RandomRewardDetailJoinSection
            amount={amount}
            onAmountChange={setAmount}
            walletBalance={walletBalance}
            onJoin={onJoin}
          />
          {participants.length > 0 ? (
            <RandomPoolParticipantList title="Users in pool" users={participants} />
          ) : null}
        </>
      ) : (
        <>
          <RandomRewardDetailEndedSection pool={pool} onClaim={onClaim} />
          {winners.length > 0 ? (
            <RandomPoolParticipantList title="Winners" users={winners} />
          ) : null}
        </>
      )}
    </div>
  );
}
