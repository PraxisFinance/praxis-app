"use client";

import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http, toCoinType } from "viem";
import { mainnet } from "viem/chains";
import { base } from "viem/chains";
import { useAccount } from "wagmi";

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

async function fetchBaseName(address: `0x${string}`) {
  const name = await mainnetClient.getEnsName({
    address,
    coinType: toCoinType(base.id),
  });
  return name;
}

export function useBaseName() {
  const { address } = useAccount();

  const { data: baseName } = useQuery({
    queryKey: ["baseName", address],
    queryFn: () => fetchBaseName(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  });

  const displayName = baseName
    ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined);

  return { baseName, displayName };
}
