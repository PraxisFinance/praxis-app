"use client";

import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi } from "viem";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/config/tokens";
import { formatTokenBalance } from "@/shared/utils/format";
import type { Balance } from "@/shared/types/balances";

const BALANCE_LABELS = {
  USDC: { label: "Wallet", iconUrl: "/icons/usdc.png" },
  PT: { label: "Deposit", iconUrl: "/icons/w-usdc.png" },
  YT: { label: "YT Token", iconUrl: "/icons/yt-token.png" },
} as const;

export function useWalletBalances() {
  const { address, isConnected } = useAccount();

  const contracts = useMemo(() => {
    if (!address) return [];
    return [
      {
        address: TOKEN_ADDRESSES.USDC,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
      },
      {
        address: TOKEN_ADDRESSES.PT,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
      },
      {
        address: TOKEN_ADDRESSES.YT,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address] as const,
      },
    ];
  }, [address]);

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const balances: Balance[] = useMemo(() => {
    const keys = ["USDC", "PT", "YT"] as const;

    return keys.map((key, i) => {
      const result = data?.[i];
      const raw =
        result?.status === "success" ? (result.result as bigint) : BigInt(0);
      const formatted = formatTokenBalance(raw, TOKEN_DECIMALS[key]);

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

  return {
    address,
    isConnected,
    balances,
    raw: { usdc: usdcBalance, pt: ptBalance, yt: ytBalance },
    isLoading,
    error,
    refetch,
  };
}
