"use client";

import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, toCoinType } from "viem";
import { mainnet, base, baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const baseClient = createPublicClient({
  chain: base,
  transport: http(),
});

const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

/**
 * Basenames (.base.eth) store their reverse records on Base L2 directly.
 * We try each chain in order and return the first match:
 *   1. Base mainnet  – direct L2 reverse lookup (Basenames)
 *   2. Base Sepolia  – same, for testnet names
 *   3. Mainnet ENSIP-19 – cross-chain reverse via CCIP-Read + coinType
 */
async function fetchBaseName(address: `0x${string}`): Promise<string | null> {
  const [baseL2Name, baseSepoliaName, ensip19Name] = await Promise.allSettled([
    baseClient.getEnsName({ address }),
    baseSepoliaClient.getEnsName({ address }),
    mainnetClient.getEnsName({ address, coinType: toCoinType(base.id) }),
  ]);

  if (baseL2Name.status === "fulfilled" && baseL2Name.value) return baseL2Name.value;
  if (baseSepoliaName.status === "fulfilled" && baseSepoliaName.value) return baseSepoliaName.value;
  if (ensip19Name.status === "fulfilled" && ensip19Name.value) return ensip19Name.value;

  return null;
}

export function useBaseName() {
  const { address } = useAccount();

  const { data: baseName } = useQuery({
    queryKey: ["baseName", address],
    queryFn: () => fetchBaseName(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  });

  const displayName =
    baseName ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined);

  return { baseName, displayName };
}
