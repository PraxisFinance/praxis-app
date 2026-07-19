"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { zeroHash } from "viem";
import { baseSepolia } from "wagmi/chains";
import { readContract } from "wagmi/actions";
import { config } from "@/config/wagmi";
import { runBatchedWrite, type ContractCall } from "@/lib/batchedWrite";
import {
  conditionalTokensAbi,
  praxisCPFAbi,
  praxisRYDAbi,
  twoPoolAbi,
} from "@/config/contracts";
import type { Claim } from "@/stores/claimsStore";
import type { TwoPoolSide } from "@/shared/types/twoPool";

export type ClaimAllStatus = "idle" | "preparing" | "claiming" | "success" | "error";

// YES_INDEX_SET=1, NO_INDEX_SET=2 — matches CPF contract constants
const CTF_PARTITION = [1n, 2n] as const;

function sideToUint8(side: TwoPoolSide): 0 | 1 {
  return side === "stable" ? 0 : 1;
}

// ─── Parsed claim types ───────────────────────────────────────────────────────

type ParsedCpfClaim = {
  id: string;
  cpfAddress: `0x${string}`;
  poolId: bigint;
};

type ParsedRydClaim = {
  id: string;
  rydAddress: `0x${string}`;
};

type ParsedTwoPoolClaim = {
  id: string;
  poolAddress: `0x${string}`;
  side: TwoPoolSide;
};

function parseClaims(claims: Claim[]) {
  const cpf: ParsedCpfClaim[] = [];
  const ryd: ParsedRydClaim[] = [];
  const twoPool: ParsedTwoPoolClaim[] = [];

  for (const c of claims) {
    const [type, ...parts] = c.eventId.split(":");

    if (type === "cpf") {
      cpf.push({
        id: c.id,
        cpfAddress: parts[0] as `0x${string}`,
        poolId: BigInt(parts[1] ?? "0"),
      });
    } else if (type === "ryd") {
      ryd.push({ id: c.id, rydAddress: parts[0] as `0x${string}` });
    } else if (type === "twopool") {
      twoPool.push({
        id: c.id,
        poolAddress: parts[0] as `0x${string}`,
        side: (parts[1]?.toLowerCase() ?? "stable") as TwoPoolSide,
      });
    }
  }

  return { cpf, ryd, twoPool };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClaimAll(pendingClaims: Claim[]) {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [status, setStatus] = useState<ClaimAllStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const claimAll = useCallback(async (): Promise<string[]> => {
    if (!address || pendingClaims.length === 0) return [];

    const { cpf, ryd, twoPool } = parseClaims(pendingClaims);
    const allIds = [
      ...cpf.map((c) => c.id),
      ...ryd.map((c) => c.id),
      ...twoPool.map((c) => c.id),
    ];

    try {
      setErrorMessage(null);
      await switchChainAsync({ chainId: baseSepolia.id });

      // Pre-read CPF pool data (needed to build call data for CTF contract)
      setStatus("preparing");
      const cpfReads = await Promise.all(
        cpf.map(async (c) => {
          const [pool, stakeToken] = await Promise.all([
            readContract(config, {
              address: c.cpfAddress,
              abi: praxisCPFAbi,
              functionName: "getPool",
              args: [c.poolId],
            }),
            readContract(config, {
              address: c.cpfAddress,
              abi: praxisCPFAbi,
              functionName: "getStakeToken",
            }),
          ]);
          return {
            ...c,
            ctfAddress: pool.ctfAddress as `0x${string}`,
            conditionId: pool.conditionId as `0x${string}`,
            stakeToken: stakeToken as `0x${string}`,
          };
        })
      );

      setStatus("claiming");

      const calls: ContractCall[] = [
        ...cpfReads.map((c) => ({
          address: c.ctfAddress,
          abi: conditionalTokensAbi,
          functionName: "redeemPositions",
          args: [c.stakeToken, zeroHash, c.conditionId, [...CTF_PARTITION]],
        })),
        ...ryd.map((c) => ({
          address: c.rydAddress,
          abi: praxisRYDAbi,
          functionName: "claim",
        })),
        ...twoPool.map((c) => ({
          address: c.poolAddress,
          abi: twoPoolAbi,
          functionName: "claimTrader",
          args: [sideToUint8(c.side)],
        })),
      ];

      if (calls.length === 0) {
        setStatus("success");
        return allIds;
      }

      await runBatchedWrite(calls);

      setStatus("success");
      return allIds;
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Claim all failed");
      return [];
    }
  }, [address, pendingClaims, switchChainAsync]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    claimAll,
    status,
    errorMessage,
    reset,
    isPending: status === "preparing" || status === "claiming",
  };
}
