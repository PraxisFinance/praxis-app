"use client";

import { useWalletBalances } from "@/hooks/useWalletBalances";
import { formatTokenBalance } from "@/shared/utils/format";
import { TOKEN_DECIMALS } from "@/config/tokens";

/**
 * On-chain YT balance for the connected wallet, used to power the drawer's
 * "Max" button and to guard against placing bets larger than the wallet holds.
 */
export function usePredictionsDrawerMaxBalance(): { maxBalance: string; ytBalance: bigint } {
  const { raw } = useWalletBalances();
  return {
    maxBalance: formatTokenBalance(raw.yt, TOKEN_DECIMALS.USDC),
    ytBalance: raw.yt,
  };
}
