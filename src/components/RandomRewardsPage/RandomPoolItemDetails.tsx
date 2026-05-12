"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { DEFAULT_BALANCES, getBalanceValueByIconUrl } from "@/shared/constants/balances";
import { isInlineHintIconUrl } from "@/shared/constants/inlineIcons";
import { YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
import { useRYDStore } from "@/stores/rydStore";
import {
  rydDataToRandomPool,
  rydParticipantToPoolUser,
  rydWinnerToPoolUser,
} from "@/shared/utils/rydMappers";
import { RandomPoolEndedDetails } from "./RandomPoolEndedDetails";
import { RandomPoolLiveDetails } from "./RandomPoolLiveDetails";
import { RandomPoolMainData } from "./RandomPoolMainData";

interface RandomPoolItemDetailsProps {
  poolId: string;
}

export function RandomPoolItemDetails({ poolId }: RandomPoolItemDetailsProps) {
  const { address } = useAccount();
  const { getRYD, fetchAllForRYD, loading } = useRYDStore();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchAllForRYD(poolId, address);
  }, [poolId, address, fetchAllForRYD]);

  const rydData = getRYD(poolId);
  const pool = useMemo(() => (rydData ? rydDataToRandomPool(rydData) : null), [rydData]);

  const participants = useMemo(
    () => (rydData?.participants ?? []).map(rydParticipantToPoolUser),
    [rydData?.participants],
  );

  const winners = useMemo(
    () => (rydData?.winners ?? []).map(rydWinnerToPoolUser),
    [rydData?.winners],
  );

  if (loading && !pool) {
    return (
      <div className="text-main-darkPurple/70 flex flex-col gap-2 py-8 text-center text-sm">
        <p>Loading pool…</p>
      </div>
    );
  }

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
        <RandomPoolEndedDetails pool={pool} winners={winners} />
      ) : (
        <RandomPoolLiveDetails
          amount={amount}
          onAmountChange={setAmount}
          walletBalance={getBalanceValueByIconUrl(
            DEFAULT_BALANCES,
            isInlineHintIconUrl(pool.iconUrl) ? YT_ICON_URL : pool.iconUrl
          )}
          participants={participants}
        />
      )}
    </div>
  );
}
