import type { Balance, BalanceInfo } from "@/shared/types/balances";

export const DEFAULT_BALANCES: Balance[] = [
  { label: "Wallet", value: "10.000", iconUrl: "/icons/usdc.png" },
  { label: "Deposit", value: "1.000", iconUrl: "/icons/w-usdc.png" },
  { label: "YT Token", value: "100", iconUrl: "/icons/yt-token.png" },
];

export const BALANCE_INFO: BalanceInfo[] = [
  {
    label: "Wallet balance",
    description: "Your full amount of principal on your connected wallet",
    iconUrl: "/icons/usdc.png",
  },
  {
    label: "Deposited balance",
    description: "Your deposited in liquidity pools",
    iconUrl: "/icons/w-usdc.png",
  },
  {
    label: "Yield Token",
    description: "Your full yield from staking and predictions",
    iconUrl: "/icons/yt-token.png",
  },
];
