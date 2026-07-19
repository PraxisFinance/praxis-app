"use client";

import { useMemo } from "react";
import { useStatisticsStore } from "@/stores/statisticsStore";
import type { BalanceChartPoint, PredictionHistoryItem as StorePredItem } from "@/stores/statisticsStore";
import type { BalancesChartDataPoint, BalancesChartInterval } from "@/shared/types/balances";
import type {
  PredictionsOverallStatsData,
  PredictionsStatsDataPoint,
  PredictionsStatsInterval,
} from "@/shared/types/profile";
import { BalancesChart } from "./BalancesChart";
import { PredictionsOverallStats } from "./PredictionsOverallStats";
import { PredictionsStatsChart } from "./PredictionsStatsChart";
import { PredictionsHistory } from "./PredictionsHistory";
import { Balances } from "../Balances/Balances";

// ── Constants ───────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

// Empty-interval sentinels — passed when historyLoaded=true but no data exists,
// so components render an empty state rather than falling back to mock data.
const EMPTY_PRED_STATS: Record<PredictionsStatsInterval, PredictionsStatsDataPoint[]> = {
  "1D": [],
  "3D": [],
  "7D": [],
  "1M": [],
  "1Y": [],
};

// ── Balance chart ───────────────────────────────────────────────────────────

type BalancesChartData = Partial<Record<BalancesChartInterval, BalancesChartDataPoint[]>>;

function buildBalancesChartData(points: BalanceChartPoint[]): BalancesChartData {
  if (!points.length) return {};
  const sorted = [...points].sort((a, b) => a.date - b.date);
  const now = Date.now();

  function slice(days: number, fmt: (ms: number) => string): BalancesChartDataPoint[] {
    const cutoff = now - days * DAY_MS;
    return sorted
      .filter((p) => p.date >= cutoff)
      .map((p) => ({
        date: fmt(p.date),
        wallet: Number(p.balance) / 1_000_000,
        deposit: 0,
        ytToken: 0,
      }));
  }

  const shortDate = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return {
    "1D": slice(1, (ms) =>
      new Date(ms).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    ),
    "3D": slice(3, shortDate),
    "7D": slice(7, (ms) => new Date(ms).toLocaleDateString("en-US", { weekday: "short" })),
    "1M": slice(30, shortDate),
    "1Y": slice(365, (ms) => new Date(ms).toLocaleDateString("en-US", { month: "short" })),
  };
}

// ── Predictions overall stats ───────────────────────────────────────────────

function buildOverallStats(
  wonMatches: number,
  lostMatches: number,
  pendingMatches: number,
  wonCurrency: bigint,
  lostCurrency: bigint
): PredictionsOverallStatsData {
  return {
    matchStats: [
      { kind: "won", label: "Won matches", value: wonMatches },
      { kind: "lost", label: "Lose matches", value: lostMatches },
      { kind: "pending", label: "Pending matches", value: pendingMatches },
    ],
    currencyStats: [
      {
        kind: "won",
        label: "Won currency",
        amount: Number(wonCurrency) / 1_000_000,
        currency: "$YT",
      },
      {
        kind: "lost",
        label: "Lost currency",
        amount: Number(lostCurrency) / 1_000_000,
        currency: "$YT",
      },
    ],
  };
}

// ── Predictions stats chart ─────────────────────────────────────────────────

function buildPredStatsData(
  items: StorePredItem[]
): Record<PredictionsStatsInterval, PredictionsStatsDataPoint[]> {
  const resolved = items.filter((i) => i.status !== "pending");
  if (!resolved.length) return EMPTY_PRED_STATS;

  const now = Date.now();

  function aggregate(
    bucketMs: number,
    days: number,
    fmt: (bucketStart: number) => string
  ): PredictionsStatsDataPoint[] {
    const cutoff = now - days * DAY_MS;
    const inPeriod = resolved.filter((i) => i.date >= cutoff);
    if (!inPeriod.length) return [];

    const byBucket = new Map<number, { win: number; lost: number }>();
    for (const item of inPeriod) {
      const bucket = Math.floor(item.date / bucketMs) * bucketMs;
      const entry = byBucket.get(bucket) ?? { win: 0, lost: 0 };
      if (item.status === "won") entry.win++;
      else entry.lost++;
      byBucket.set(bucket, entry);
    }

    return Array.from(byBucket.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([bucketStart, { win, lost }]) => ({
        date: fmt(bucketStart),
        count: win + lost,
        win,
        lost,
      }));
  }

  const shortDate = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return {
    "1D": aggregate(HOUR_MS, 1, (ms) =>
      new Date(ms).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    ),
    "3D": aggregate(DAY_MS, 3, shortDate),
    "7D": aggregate(DAY_MS, 7, (ms) =>
      new Date(ms).toLocaleDateString("en-US", { weekday: "short" })
    ),
    "1M": aggregate(DAY_MS, 30, shortDate),
    "1Y": aggregate(DAY_MS * 30, 365, (ms) =>
      new Date(ms).toLocaleDateString("en-US", { month: "short" })
    ),
  };
}

// ── Component ───────────────────────────────────────────────────────────────

export function BalancesSubPage() {
  const historyLoaded = useStatisticsStore((s) => s.historyLoaded);
  const balanceChart = useStatisticsStore((s) => s.balanceChart);
  const predictionHistory = useStatisticsStore((s) => s.predictionHistory);
  const wonMatches = useStatisticsStore((s) => s.wonMatches);
  const lostMatches = useStatisticsStore((s) => s.lostMatches);
  const pendingMatches = useStatisticsStore((s) => s.pendingMatches);
  const wonCurrency = useStatisticsStore((s) => s.wonCurrency);
  const lostCurrency = useStatisticsStore((s) => s.lostCurrency);

  const balancesData = useMemo(() => buildBalancesChartData(balanceChart), [balanceChart]);

  // When historyLoaded=false (not yet fetched), pass undefined so components
  // render their mock preview. Once loaded, always pass real data — even when
  // all zeros — so mock data is never shown to a connected wallet.
  const overallStats = useMemo(
    () =>
      historyLoaded
        ? buildOverallStats(wonMatches, lostMatches, pendingMatches, wonCurrency, lostCurrency)
        : undefined,
    [historyLoaded, wonMatches, lostMatches, pendingMatches, wonCurrency, lostCurrency]
  );
  const predStatsData = useMemo(
    () => (historyLoaded ? buildPredStatsData(predictionHistory) : undefined),
    [historyLoaded, predictionHistory]
  );

  return (
    <div className="flex flex-col gap-6">
      <Balances />
      <BalancesChart data={balancesData} />
      <PredictionsOverallStats data={overallStats} />
      <PredictionsStatsChart data={predStatsData} />
      <PredictionsHistory />
    </div>
  );
}
