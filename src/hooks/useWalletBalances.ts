"use client";

import { useMemo, useCallback } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi } from "viem";
import { baseSepolia } from "wagmi/chains";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/config/tokens";
import { useActiveVault } from "@/stores/activeVaultStore";
import { formatTokenBalance } from "@/shared/utils/format";
import type { Balance } from "@/shared/types/balances";
import { USDC_ICON_URL, WUSDC_ICON_URL, YT_ICON_URL } from "@/shared/constants/tokenIconUrls";

const BALANCE_LABELS = {
  USDC: { label: "Wallet", iconUrl: USDC_ICON_URL },
  PT: { label: "Deposit", iconUrl: WUSDC_ICON_URL },
  YT: { label: "YT Token", iconUrl: YT_ICON_URL },
} as const;

export function useWalletBalances() {
  const { address, isConnected } = useAccount();
  const { pt, yt } = useActiveVault();

  const contracts = useMemo(() => {
    if (!address || !pt || !yt) return [];
    return [
      {
        address: TOKEN_ADDRESSES.USDC,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
        chainId: baseSepolia.id,
      },
      {
        address: pt,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
        chainId: baseSepolia.id,
      },
      {
        address: yt,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
        chainId: baseSepolia.id,
      },
    ];
  }, [address, pt, yt]);

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: isConnected && !!address && !!pt && !!yt,
    },
  });

  const balances: Balance[] = useMemo(() => {
    const keys = ["USDC", "PT", "YT"] as const;

    return keys.map((key, i) => {
      const result = data?.[i];
      const raw =
        result?.status === "success" ? (result.result as bigint) : BigInt(0);
      const formatted = formatTokenBalance(raw, TOKEN_DECIMALS.USDC);

      return {
        label: BALANCE_LABELS[key].label,
        value: formatted,
        iconUrl: BALANCE_LABELS[key].iconUrl,
      };
    });
  }, [data]);

  const usdcBalance = data?.[0]?.status === "success" ? (data[0].result as bigint) : BigInt(0);
  const ptBalance = data?.[1]?.status === "success" ? (data[1].result as bigint) : BigInt(0);
  const ytBalance = data?.[2]?.status === "success" ? (data[2].result as bigint) : BigInt(0);

  // RPC nodes can lag behind the chain state even after a receipt is confirmed.
  // Waiting a short period before re-reading avoids getting stale balances.
  const POST_TX_REFETCH_DELAY_MS = 2000;

  const refetchAfterDelay = useCallback(
    (delay = POST_TX_REFETCH_DELAY_MS) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          void refetch().then(() => resolve());
        }, delay);
      }),
    [refetch]
  );

  return {
    address,
    isConnected,
    balances,
    raw: { usdc: usdcBalance, pt: ptBalance, yt: ytBalance },
    isLoading,
    error,
    refetch,
    refetchAfterDelay,
  };
}
