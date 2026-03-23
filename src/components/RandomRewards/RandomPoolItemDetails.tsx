"use client";

import { useMemo, useState } from "react";
import { DEFAULT_BALANCES } from "@/shared/constants/balances";
import { RANDOM_POOL_MOCKS } from "@/shared/constants/randomRewards";
import { RandomPoolEndedDetails } from "./RandomPoolEndedDetails";
import { RandomPoolLiveDetails } from "./RandomPoolLiveDetails";
import { RandomPoolMainData } from "./RandomPoolMainData";

interface RandomPoolItemDetailsProps {
  poolId: string;
}

export function RandomPoolItemDetails({ poolId }: RandomPoolItemDetailsProps) {
  const [amount, setAmount] = useState("");
  const walletBalance = DEFAULT_BALANCES[0]?.value ?? "0.000";

  const pool = useMemo(
    () => RANDOM_POOL_MOCKS.find((p) => p.id === poolId) ?? null,
    [poolId]
  );

  if (!pool) {
    return (
      <div className="text-main-darkPurple/70 flex flex-col gap-2 py-8 text-center text-sm">
        <p>Pool not found.</p>
        <p className="text-main-darkPurple/50 text-xs">ID: {poolId}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <RandomPoolMainData pool={pool} />
      {pool.status === "ended" ? (
        <RandomPoolEndedDetails pool={pool} />
      ) : (
        <RandomPoolLiveDetails
          amount={amount}
          onAmountChange={setAmount}
          walletBalance={walletBalance}
        />
      )}
    </div>
  );
}
