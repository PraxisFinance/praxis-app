"use client";

import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http } from "viem";
import { mainnet, base, baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";

// ENSIP-19 L2 Reverse Registrar — deployed by ENS at the same address on every
// supported L2 (Base, Optimism, Arbitrum, Linea, Scroll).
// viem's getEnsName() silently returns null on Base because the `base` chain
// definition in viem/chains has no ensUniversalResolver configured.
// We bypass that by calling nameForAddr() on this contract directly.
const ENSIP19_L2_REVERSE = "0x0000000000D8e504002cC26E3Ec46D81971C1664" as const;

const ENSIP19_ABI = [
  {
    name: "nameForAddr",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "addr", type: "address" }],
    outputs: [{ name: "name", type: "string" }],
  },
] as const;

const mainnetClient = createPublicClient({ chain: mainnet, transport: http() });
const baseClient = createPublicClient({ chain: base, transport: http() });
const baseSepoliaClient = createPublicClient({ chain: baseSepolia, transport: http() });

/**
 * Resolves a Basename (.base.eth) or ENS name for an address.
 * Priority:
 *   1. Base mainnet  — ENSIP-19 L2 Reverse Registrar (nameForAddr)
 *   2. Base Sepolia  — same contract, testnet
 *   3. Mainnet ENS   — fallback for plain .eth names
 */
async function fetchBaseName(address: `0x${string}`): Promise<string | null> {
  const [baseL2Name, baseSepoliaName, mainnetName] = await Promise.allSettled([
    baseClient.readContract({
      address: ENSIP19_L2_REVERSE,
      abi: ENSIP19_ABI,
      functionName: "nameForAddr",
      args: [address],
    }),
    baseSepoliaClient.readContract({
      address: ENSIP19_L2_REVERSE,
      abi: ENSIP19_ABI,
      functionName: "nameForAddr",
      args: [address],
    }),
    mainnetClient.getEnsName({ address }),
  ]);

  if (baseL2Name.status === "fulfilled" && baseL2Name.value) return baseL2Name.value;
  if (baseSepoliaName.status === "fulfilled" && baseSepoliaName.value) return baseSepoliaName.value;
  if (mainnetName.status === "fulfilled" && mainnetName.value) return mainnetName.value;

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
