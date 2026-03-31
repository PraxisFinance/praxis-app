import type {
  PredictionsOverallStatsData,
  PredictionsStatsDataPoint,
  PredictionsStatsInterval,
  PredictionsStatsLineMeta,
} from "@/shared/types/profile";

// ── Predictions stats chart ────────────────────────────────────────────────

export const PREDICTIONS_STATS_INTERVALS: { id: PredictionsStatsInterval; label: string }[] = [
  { id: "1D", label: "1 day"   },
  { id: "3D", label: "3 days"  },
  { id: "7D", label: "7 days"  },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year"  },
];

export const PREDICTIONS_STATS_LINE_META: PredictionsStatsLineMeta[] = [
  { key: "count", label: "Total", color: "#9787f4" },
  { key: "win",   label: "Won",   color: "#34C53E" },
  { key: "lost",  label: "Lost",  color: "#ff5858" },
];

// ── Mock data ─────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Builds a random-walk series guaranteed to stay >= 0. */
function randomWalk(n: number, start: number, volatility: number, drift: number, seed: number): number[] {
  const rng = makeRng(seed);
  const out: number[] = [start];
  for (let i = 1; i < n; i++) {
    const step = (rng() - 0.5) * 2 * volatility + drift;
    out.push(Math.max(0, Math.round(out[i - 1] + step)));
  }
  return out;
}

/** win + lost are independently walked but clamped to count. */
function buildStatsPoints(dates: string[], countSeed: number, winSeed: number, lostSeed: number, base: number, vol: number): PredictionsStatsDataPoint[] {
  const n = dates.length;
  const counts = randomWalk(n, base,             vol,       0.3, countSeed);
  const wins   = randomWalk(n, Math.round(base * 0.55), vol * 0.6, 0.2, winSeed);
  const losts  = randomWalk(n, Math.round(base * 0.30), vol * 0.4, 0.1, lostSeed);
  return dates.map((date, i) => ({
    date,
    count: counts[i],
    win:   Math.min(wins[i],  counts[i]),
    lost:  Math.min(losts[i], counts[i] - Math.min(wins[i], counts[i])),
  }));
}

const mock1D  = buildStatsPoints(Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`), 11, 22, 33, 8,  3);
const mock3D  = buildStatsPoints(Array.from({ length: 12 }, (_, i) => { const d = Math.floor(i / 4) + 1; const h = (i % 4) * 6; return `D${d} ${String(h).padStart(2, "0")}h`; }), 44, 55, 66, 20, 7);
const mock7D  = buildStatsPoints(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], 77, 88, 99, 35, 12);
const mock1M  = buildStatsPoints(Array.from({ length: 10 }, (_, i) => `Mar ${i * 3 + 1}`), 111, 222, 333, 60, 20);
const mock1Y  = buildStatsPoints(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], 444, 555, 666, 100, 35);

export const PREDICTIONS_STATS_MOCK_DATA: Record<PredictionsStatsInterval, PredictionsStatsDataPoint[]> = {
  "1D": mock1D,
  "3D": mock3D,
  "7D": mock7D,
  "1M": mock1M,
  "1Y": mock1Y,
};

// ── Predictions overall stats ──────────────────────────────────────────────

export const PREDICTIONS_OVERALL_STATS_MOCK: PredictionsOverallStatsData = {
  matchStats: [
    { kind: "won",     label: "Won matches",     value: 101 },
    { kind: "lost",    label: "Lose matches",    value: 54  },
    { kind: "pending", label: "Pending matches", value: 15  },
  ],
  currencyStats: [
    { kind: "won",  label: "Won currency",  amount: 1000, currency: "$wUSDC" },
    { kind: "lost", label: "Lost currency", amount: 500,  currency: "$wUSDC" },
  ],
};
