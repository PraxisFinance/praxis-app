"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/config/wagmi";
import { twoPoolAbi } from "@/config/contracts";
import { TOKEN_DECIMALS } from "@/config/tokens";
import { useActiveVault } from "@/stores/activeVaultStore";
import { parseTokenAmount } from "@/shared/utils/format";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import { ensureAppChain } from "@/lib/ensureAppChain";
import { useTrackAchievement } from "./useTrackAchievement";

export type TwoPoolDepositStatus = "idle" | "approving" | "depositing" | "success" | "error";
export type TwoPoolClaimStatus = "idle" | "claiming" | "success" | "error";

function sideToUint8(side: TwoPoolSide): 0 | 1 {
  return side === "stable" ? 0 : 1;
}

export function useTwoPool(pool: TwoPool, side: TwoPoolSide, amountInput: string) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();

  const [depositStatus, setDepositStatus] = useState<TwoPoolDepositStatus>("idle");
  const [depositError, setDepositError] = useState<string | null>(null);

  const [claimStatus, setClaimStatus] = useState<TwoPoolClaimStatus>("idle");
  const [claimError, setClaimError] = useState<string | null>(null);

  const { yt } = useActiveVault();
  const poolAddress = pool.id as `0x${string}`;
  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);

  // ─── Deposit ────────────────────────────────────────────────────────────

  const deposit = useCallback(async () => {
    if (!address) {
      setDepositError("Wallet not connected");
      setDepositStatus("error");
      return;
    }

    if (!yt) {
      setDepositError("No active vault");
      setDepositStatus("error");
      return;
    }

    if (amount === BigInt(0)) {
      setDepositError("Enter an amount");
      setDepositStatus("error");
      return;
    }

    try {
      setDepositError(null);

      await ensureAppChain(chainId, switchChainAsync);

      const allowance = await readContract(config, {
        address: yt,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, poolAddress],
      });

      if (allowance < amount) {
        setDepositStatus("approving");
        const approveTx = await writeContractAsync({
          address: yt,
          abi: erc20Abi,
          functionName: "approve",
          args: [poolAddress, amount],
        });
        await waitForTransactionReceipt(config, { hash: approveTx });
      }

      setDepositStatus("depositing");

      const depositTx = await writeContractAsync({
        address: poolAddress,
        abi: twoPoolAbi,
        functionName: "deposit",
        // TODO: Add minNet
        args: [sideToUint8(side), amount, BigInt(0)],
      });

      await waitForTransactionReceipt(config, { hash: depositTx });
      trackAchievement("twopool.deposit", depositTx);
      setDepositStatus("success");
    } catch (err) {
      setDepositStatus("error");
      setDepositError(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, amount, chainId, poolAddress, side, switchChainAsync, writeContractAsync, yt, trackAchievement]);

  const resetDeposit = useCallback(() => {
    setDepositStatus("idle");
    setDepositError(null);
  }, []);

  // ─── Claim ──────────────────────────────────────────────────────────────

  const claimTrader = useCallback(
    async (claimSide: TwoPoolSide) => {
      if (!address) {
        setClaimError("Wallet not connected");
        setClaimStatus("error");
        return;
      }

      try {
        setClaimError(null);
        setClaimStatus("claiming");

        await ensureAppChain(chainId, switchChainAsync);

        const claimTx = await writeContractAsync({
          address: poolAddress,
          abi: twoPoolAbi,
          functionName: "claimTrader",
          args: [sideToUint8(claimSide)],
        });

        await waitForTransactionReceipt(config, { hash: claimTx });
        trackAchievement("twopool.claim", claimTx);
        setClaimStatus("success");
      } catch (err) {
        setClaimStatus("error");
        setClaimError(err instanceof Error ? err.message : "Transaction failed");
      }
    },
    [address, chainId, poolAddress, switchChainAsync, writeContractAsync, trackAchievement],
  );

  const claimLP = useCallback(async () => {
    if (!address) {
      setClaimError("Wallet not connected");
      setClaimStatus("error");
      return;
    }

    try {
      setClaimError(null);
      setClaimStatus("claiming");

      await ensureAppChain(chainId, switchChainAsync);

      const claimTx = await writeContractAsync({
        address: poolAddress,
        abi: twoPoolAbi,
        functionName: "claimLP",
      });

      await waitForTransactionReceipt(config, { hash: claimTx });
      trackAchievement("twopool.claim", claimTx);
      setClaimStatus("success");
    } catch (err) {
      setClaimStatus("error");
      setClaimError(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, poolAddress, switchChainAsync, writeContractAsync, trackAchievement]);

  const resetClaim = useCallback(() => {
    setClaimStatus("idle");
    setClaimError(null);
  }, []);

  return {
    // deposit
    deposit,
    depositStatus,
    depositError,
    resetDeposit,
    isDepositPending: depositStatus === "approving" || depositStatus === "depositing",
    // claim
    claimTrader,
    claimLP,
    claimStatus,
    claimError,
    resetClaim,
    isClaimPending: claimStatus === "claiming",
  };
}
