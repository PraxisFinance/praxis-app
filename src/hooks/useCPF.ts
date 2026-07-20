"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi, zeroHash } from "viem";
import { config } from "@/config/wagmi";
import { praxisCPFAbi, conditionalTokensAbi } from "@/config/contracts";
import { TOKEN_DECIMALS } from "@/config/tokens";
import { useActiveVault } from "@/stores/activeVaultStore";
import { parseTokenAmount, formatTokenBalance } from "@/shared/utils/format";
import { ensureAppChain } from "@/lib/ensureAppChain";
import { runBatchedWrite } from "@/lib/batchedWrite";
import { useTrackAchievement } from "./useTrackAchievement";

export type CPFBetStatus = "idle" | "approving" | "depositing" | "success" | "error";
export type CPFClaimStatus = "idle" | "claiming" | "success" | "error";

// YES_INDEX_SET=1, NO_INDEX_SET=2 — matches contract constants
const CTF_PARTITION = [1n, 2n] as const;

export function useCPF(
  cpfAddress: `0x${string}`,
  cpfPoolId: bigint,
  amountInput: string,
  inFavor: boolean,
  ytBalance: bigint = 0n,
  minTokensOut: bigint = 0n,
) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();

  const [betStatus, setBetStatus] = useState<CPFBetStatus>("idle");
  const [betError, setBetError] = useState<string | null>(null);

  const [claimStatus, setClaimStatus] = useState<CPFClaimStatus>("idle");
  const [claimError, setClaimError] = useState<string | null>(null);

  const { yt } = useActiveVault();
  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);
  const insufficientBalance = amount > BigInt(0) && amount > ytBalance;

  // ─── Bet ────────────────────────────────────────────────────────────────

  const placeBet = useCallback(async () => {
    if (!address) {
      setBetError("Wallet not connected");
      setBetStatus("error");
      return;
    }

    if (!yt) {
      setBetError("No active vault");
      setBetStatus("error");
      return;
    }

    if (amount === BigInt(0)) {
      setBetError("Enter an amount");
      setBetStatus("error");
      return;
    }

    if (amount > ytBalance) {
      setBetError(
        `Insufficient YT balance. Need ${formatTokenBalance(amount, TOKEN_DECIMALS.USDC)} YT but you only have ${formatTokenBalance(ytBalance, TOKEN_DECIMALS.USDC)} YT.`
      );
      setBetStatus("error");
      return;
    }

    if (!cpfAddress) {
      setBetError("Contract address not configured");
      setBetStatus("error");
      return;
    }

    try {
      setBetError(null);

      await ensureAppChain(chainId, switchChainAsync);

      const allowance = await readContract(config, {
        address: yt,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, cpfAddress],
      });

      const needsApproval = allowance < amount;
      setBetStatus(needsApproval ? "approving" : "depositing");

      const { hash } = await runBatchedWrite(
        [
          needsApproval && {
            address: yt,
            abi: erc20Abi,
            functionName: "approve",
            args: [cpfAddress, amount],
          },
          {
            address: cpfAddress,
            abi: praxisCPFAbi,
            functionName: "buy",
            args: [cpfPoolId, amount, inFavor, minTokensOut],
          },
        ],
        {
          onStep: (index, total) =>
            setBetStatus(needsApproval && total > 1 && index === 0 ? "approving" : "depositing"),
        },
      );

      if (hash) trackAchievement("cpf.predict", hash);
      setBetStatus("success");
    } catch (err) {
      setBetStatus("error");
      setBetError(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, cpfAddress, cpfPoolId, amount, inFavor, ytBalance, minTokensOut, switchChainAsync, writeContractAsync, yt, trackAchievement]);

  const resetBet = useCallback(() => {
    setBetStatus("idle");
    setBetError(null);
  }, []);

  // ─── Claim ──────────────────────────────────────────────────────────────

  const claim = useCallback(async () => {
    if (!address) {
      setClaimError("Wallet not connected");
      setClaimStatus("error");
      return;
    }

    if (!cpfAddress) {
      setClaimError("Contract address not configured");
      setClaimStatus("error");
      return;
    }

    try {
      setClaimError(null);
      setClaimStatus("claiming");

      await ensureAppChain(chainId, switchChainAsync);

      // Read pool metadata and stake token in parallel — both needed for the CTF call.
      const [pool, stakeToken] = await Promise.all([
        readContract(config, {
          address: cpfAddress,
          abi: praxisCPFAbi,
          functionName: "getPool",
          args: [cpfPoolId],
        }),
        readContract(config, {
          address: cpfAddress,
          abi: praxisCPFAbi,
          functionName: "getStakeToken",
        }),
      ]);

      // Winners (and void holders) redeem directly on the CTF. The full partition
      // [YES, NO] is passed so the CTF resolves whichever side has a non-zero payout.
      const claimTx = await writeContractAsync({
        address: pool.ctfAddress as `0x${string}`,
        abi: conditionalTokensAbi,
        functionName: "redeemPositions",
        args: [stakeToken, zeroHash, pool.conditionId, [...CTF_PARTITION]],
      });

      await waitForTransactionReceipt(config, { hash: claimTx });
      trackAchievement("cpf.claim", claimTx);
      setClaimStatus("success");
    } catch (err) {
      setClaimStatus("error");
      setClaimError(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, cpfAddress, cpfPoolId, switchChainAsync, writeContractAsync, trackAchievement]);

  const resetClaim = useCallback(() => {
    setClaimStatus("idle");
    setClaimError(null);
  }, []);

  return {
    // bet
    placeBet,
    betStatus,
    betError,
    resetBet,
    insufficientBalance,
    isBetPending: betStatus === "approving" || betStatus === "depositing",
    // claim
    claim,
    claimStatus,
    claimError,
    resetClaim,
    isClaimPending: claimStatus === "claiming",
  };
}
