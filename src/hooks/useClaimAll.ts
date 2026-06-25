"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import {
  encodeFunctionData,
  zeroHash,
} from "viem";
import { baseSepolia } from "wagmi/chains";
import {
  getCapabilities,
  readContract,
  sendCalls,
  waitForCallsStatus,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { config } from "@/config/wagmi";
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
  const { writeContractAsync } = useWriteContract();

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

      // Check EIP-5792 atomicBatch capability
      let useBatch = false;
      try {
        const capabilities = await getCapabilities(config);
        useBatch = capabilities?.[baseSepolia.id]?.atomicBatch?.supported ?? false;
      } catch {
        // Wallet doesn't support capability queries — fall back to sequential
      }

      if (useBatch) {
        const calls = [
          ...cpfReads.map((c) => ({
            to: c.ctfAddress,
            data: encodeFunctionData({
              abi: conditionalTokensAbi,
              functionName: "redeemPositions",
              args: [c.stakeToken, zeroHash, c.conditionId, [...CTF_PARTITION]],
            }),
          })),
          ...ryd.map((c) => ({
            to: c.rydAddress,
            data: encodeFunctionData({ abi: praxisRYDAbi, functionName: "claim" }),
          })),
          ...twoPool.map((c) => ({
            to: c.poolAddress,
            data: encodeFunctionData({
              abi: twoPoolAbi,
              functionName: "claimTrader",
              args: [sideToUint8(c.side)],
            }),
          })),
        ];

        const batchId = await sendCalls(config, { calls, chainId: baseSepolia.id });
        await waitForCallsStatus(config, batchId);
      } else {
        // Sequential fallback
        for (const c of cpfReads) {
          const tx = await writeContractAsync({
            address: c.ctfAddress,
            abi: conditionalTokensAbi,
            functionName: "redeemPositions",
            args: [c.stakeToken, zeroHash, c.conditionId, [...CTF_PARTITION]],
            chainId: baseSepolia.id,
          });
          await waitForTransactionReceipt(config, { hash: tx });
        }

        for (const c of ryd) {
          const tx = await writeContractAsync({
            address: c.rydAddress,
            abi: praxisRYDAbi,
            functionName: "claim",
            chainId: baseSepolia.id,
          });
          await waitForTransactionReceipt(config, { hash: tx });
        }

        for (const c of twoPool) {
          const tx = await writeContractAsync({
            address: c.poolAddress,
            abi: twoPoolAbi,
            functionName: "claimTrader",
            args: [sideToUint8(c.side)],
            chainId: baseSepolia.id,
          });
          await waitForTransactionReceipt(config, { hash: tx });
        }
      }

      setStatus("success");
      return allIds;
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Claim all failed");
      return [];
    }
  }, [address, pendingClaims, switchChainAsync, writeContractAsync]);

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
