import type { TwoPool } from "@/shared/types/twoPool";

function isoInHours(hoursFromNow: number): string {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

const MOCK_ICON = "/icons/usdc.png";

export const TWO_POOL_MOCKS: TwoPool[] = [
  {
    id: "btc-twopool-live",
    title: "BTC Two-Pool",
    assetSymbol: "BTC",
    iconUrl: MOCK_ICON,
    status: { kind: "live", label: "Live now" },
    endsAt: isoInHours(72),
    isTradingOpen: true,
    targetApyPercent: 8,
    predictedApyPercent: 10.5,
    stablePoolPercent: 42,
    elevatedPoolPercent: 58,
    stableEntranceFeePercent: 0.35,
    elevatedEntranceFeePercent: 0.85,
  },
  {
    id: "eth-twopool-upcoming",
    title: "ETH Two-Pool",
    assetSymbol: "ETH",
    iconUrl: MOCK_ICON,
    status: { kind: "upcoming", startsAt: isoInHours(4) },
    endsAt: isoInHours(96),
    isTradingOpen: true,
    targetApyPercent: 12,
    predictedApyPercent: 9.2,
    stablePoolPercent: 61,
    elevatedPoolPercent: 39,
    stableEntranceFeePercent: 0.5,
    elevatedEntranceFeePercent: 1.1,
  },
];

export function getTwoPoolById(id: string): TwoPool | undefined {
  return TWO_POOL_MOCKS.find((p) => p.id === id);
}
