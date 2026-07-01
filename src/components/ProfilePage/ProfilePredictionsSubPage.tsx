"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Balances } from "../Balances/Balances";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ProfilePredictionCard } from "./ProfilePredictionCard";
import {
  PROFILE_PREDICTION_STATUS_FILTERS,
  PROFILE_PREDICTION_TIME_INTERVALS,
} from "@/shared/constants/profile";
import type {
  ProfilePredictionItem,
  ProfilePredictionStatusFilter,
  ProfilePredictionTimeInterval,
} from "@/shared/types/profile";
import { WUSDC_ICON_URL, YT_ICON_URL } from "@/shared/constants/tokenIconUrls";
import { useStatisticsStore } from "@/stores/statisticsStore";
import type { PredictionHistoryItem as StorePredictionHistoryItem } from "@/stores/statisticsStore";

type DatedProfilePredictionItem = ProfilePredictionItem & {
  date: number;
};

const DAY_MS = 86_400_000;
const NOW_BUCKET_MS = 60_000;

const TIME_INTERVAL_DAYS: Record<ProfilePredictionTimeInterval, number> = {
  "1D": 1,
  "3D": 3,
  "7D": 7,
  "1M": 30,
  "1Y": 365,
};

function useProfilePredictionsNowMs(): number {
  const bucket = useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setInterval(onStoreChange, NOW_BUCKET_MS);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / NOW_BUCKET_MS),
    () => 0
  );
  return bucket * NOW_BUCKET_MS;
}

function formatWUsdcAmount(amount: bigint): string {
  const value = Number(amount < 0n ? -amount : amount) / 1_000_000;
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value === 0 ? 0 : 2,
  }).format(value)} wUSDC`;
}

function historyItemToProfilePrediction(
  item: StorePredictionHistoryItem
): DatedProfilePredictionItem {
  const userWon = item.status === "won";
  const ended = item.status !== "pending";

  if (item.kind === "ryd") {
    const deposit = formatWUsdcAmount(item.amount);
    const prize = formatWUsdcAmount(item.prize ?? 0n);
    return {
      id: item.id,
      kind: "pool",
      name: item.label,
      iconUrl: YT_ICON_URL,
      ended,
      userWon,
      tvl: `$${deposit}`,
      earnings: userWon ? `$${prize}` : "$0 wUSDC",
      usersWon: 0,
      progressPercent: ended ? 100 : 0,
      date: item.date,
    };
  }

  const amount = formatWUsdcAmount(item.amount);
  return {
    id: item.id,
    kind: "match",
    name: item.label,
    iconUrl: WUSDC_ICON_URL,
    ended,
    userWon,
    coeff: 1,
    prediction: `$${amount}`,
    earnings: userWon ? `$${amount}` : "$0 wUSDC",
    date: item.date,
  };
}

export function ProfilePredictionsSubPage() {
  const [statusFilter, setStatusFilter] = useState<ProfilePredictionStatusFilter>("all");
  const [timeInterval, setTimeInterval] = useState<ProfilePredictionTimeInterval>("1D");
  const nowMs = useProfilePredictionsNowMs();
  const predictionHistory = useStatisticsStore((s) => s.predictionHistory);

  const predictions = useMemo(
    () => predictionHistory.map(historyItemToProfilePrediction),
    [predictionHistory]
  );

  const filtered = useMemo(() => {
    const cutoff = nowMs - TIME_INTERVAL_DAYS[timeInterval] * DAY_MS;
    return predictions.filter((item) => {
      if (item.date < cutoff) return false;
      if (statusFilter === "complete") return item.ended;
      if (statusFilter === "in_progress") return !item.ended;
      return true;
    });
  }, [nowMs, predictions, statusFilter, timeInterval]);

  function handleClaim(id: string) {
    console.log("claim prediction", id);
  }

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <SectionHeader>Predictions</SectionHeader>

          <div className="flex items-center gap-2 shrink-0">
            <FilterDropdown
              options={PROFILE_PREDICTION_STATUS_FILTERS}
              value={statusFilter}
              onChange={setStatusFilter}
              minWidth="120px"
            />
            <FilterDropdown
              options={PROFILE_PREDICTION_TIME_INTERVALS}
              value={timeInterval}
              onChange={setTimeInterval}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <ProfilePredictionCard key={item.id} item={item} onClaim={handleClaim} />
            ))
          ) : (
            <p className="text-main-darkPurple/50 text-sm text-center py-6">
              No predictions found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
