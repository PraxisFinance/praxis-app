import type {
  Balance,
  BalanceInfo,
  BalanceCurrencyMeta,
  BalancesChartInterval,
  BalancesChartDataPoint,
} from "@/shared/types/balances";
import { USDC_ICON_URL, YT_ICON_URL } from "@/shared/constants/tokenIconUrls";

export const DEFAULT_BALANCES: Balance[] = [
  { label: "Wallet", value: "0", iconUrl: USDC_ICON_URL },
  { label: "Deposit", value: "0", iconUrl: USDC_ICON_URL },
  { label: "YT Token", value: "0", iconUrl: YT_ICON_URL },
];

export const BALANCE_INFO: BalanceInfo[] = [
  {
    label: "Wallet balance",
    description: "Your full amount of principal on your connected wallet",
    iconUrl: USDC_ICON_URL,
  },
  {
    label: "Deposited balance",
    description: "Your deposited in liquidity pools",
    iconUrl: USDC_ICON_URL,
  },
  {
    label: "Yield Token",
    description: "Your full yield from staking and predictions",
    iconUrl: YT_ICON_URL,
  },
];

// ── Chart ──────────────────────────────────────────────────────────────────

export const BALANCES_CHART_INTERVALS: { id: BalancesChartInterval; label: string }[] = [
  { id: "1D", label: "1 day" },
  { id: "3D", label: "3 days" },
  { id: "7D", label: "7 days" },
  { id: "1M", label: "1 month" },
  { id: "1Y", label: "1 year" },
];

/** Visual metadata for each currency line on the balance chart. */
export const BALANCE_CURRENCY_META: BalanceCurrencyMeta[] = [
  { key: "wallet", label: "Wallet", color: "#9787f4", iconUrl: USDC_ICON_URL },
  { key: "deposit", label: "Deposit", color: "#34C53E", iconUrl: USDC_ICON_URL },
  { key: "ytToken", label: "YT Token", color: "#ff5858", iconUrl: YT_ICON_URL },
];

// ── Mock data helpers ───────────────────────────────────────────────────────

/** Seeded LCG — deterministic, no Math.random, stable across SSR/CSR. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Builds a random-walk series of `n` values.
 * `volatility` controls max step size per tick; `drift` adds a tiny trend.
 */
function randomWalk(
  n: number,
  start: number,
  volatility: number,
  drift: number,
  seed: number
): number[] {
  const rng = makeRng(seed);
  const out: number[] = [start];
  for (let i = 1; i < n; i++) {
    const step = (rng() - 0.5) * 2 * volatility + drift;
    out.push(Math.max(1, Math.round(out[i - 1] + step)));
  }
  return out;
}

function buildPoints<T extends string>(
  dates: string[],
  series: Record<T, number[]>
): ({ date: string } & Record<T, number>)[] {
  return dates.map(
    (date, i) =>
      Object.fromEntries([
        ["date", date],
        ...Object.entries(series).map(([k, v]) => [k, (v as number[])[i]]),
      ]) as {
        date: string;
      } & Record<T, number>
  );
}

// 1D — 24 hourly ticks
const dates1D = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const mock1D = buildPoints(dates1D, {
  wallet: randomWalk(24, 10_000, 900, -10, 11),
  deposit: randomWalk(24, 1_000, 110, -1, 22),
  ytToken: randomWalk(24, 100, 18, 0, 33),
});

// 3D — 12 ticks every 6 h
const dates3D = Array.from({ length: 12 }, (_, i) => {
  const day = Math.floor(i / 4) + 1;
  const hour = (i % 4) * 6;
  return `D${day} ${String(hour).padStart(2, "0")}h`;
});
const mock3D = buildPoints(dates3D, {
  wallet: randomWalk(12, 9_500, 1_200, 30, 44),
  deposit: randomWalk(12, 950, 150, 3, 55),
  ytToken: randomWalk(12, 95, 22, 0.5, 66),
});

// 7D — daily ticks
const dates7D = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mock7D = buildPoints(dates7D, {
  wallet: randomWalk(7, 9_000, 2_000, 150, 77),
  deposit: randomWalk(7, 900, 250, 15, 88),
  ytToken: randomWalk(7, 90, 40, 1.5, 99),
});

// 1M — 10 ticks every 3 days
const dates1M = Array.from({ length: 10 }, (_, i) => `Mar ${i * 3 + 1}`);
const mock1M = buildPoints(dates1M, {
  wallet: randomWalk(10, 8_000, 2_800, 200, 111),
  deposit: randomWalk(10, 800, 350, 20, 222),
  ytToken: randomWalk(10, 80, 55, 3, 333),
});

// 1Y — 12 monthly ticks
const dates1Y = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const mock1Y = buildPoints(dates1Y, {
  wallet: randomWalk(12, 5_000, 3_500, 500, 444),
  deposit: randomWalk(12, 500, 450, 50, 555),
  ytToken: randomWalk(12, 50, 70, 6, 666),
});

export const BALANCES_CHART_MOCK_DATA: Record<BalancesChartInterval, BalancesChartDataPoint[]> = {
  "1D": mock1D,
  "3D": mock3D,
  "7D": mock7D,
  "1M": mock1M,
  "1Y": mock1Y,
};

// ── Utils ──────────────────────────────────────────────────────────────────

/** Resolves a numeric balance string for a currency icon, with fallback when unknown. */
export function getBalanceValueByIconUrl(
  balances: Balance[],
  iconUrl: string | undefined,
  fallbackIndex = 0
): string {
  if (iconUrl) {
    const found = balances.find((b) => b.iconUrl === iconUrl);
    if (found) return found.value;
  }
  return balances[fallbackIndex]?.value ?? "0";
}
