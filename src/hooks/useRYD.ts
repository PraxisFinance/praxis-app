"use client";

import { useState, useCallback } from "react";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { baseSepolia } from "wagmi/chains";
import { config } from "@/config/wagmi";
import { TOKEN_DECIMALS } from "@/config/tokens";
import { useActiveVault } from "@/stores/activeVaultStore";
import { praxisRYDAbi } from "@/config/contracts";
import { parseTokenAmount, formatTokenBalance } from "@/shared/utils/format";
import { runBatchedWrite } from "@/lib/batchedWrite";
import { useTrackAchievement } from "./useTrackAchievement";

// ── Deposit YT into RYD ───────────────────────────────────────────────

export type RYDDepositStatus = "idle" | "approving" | "depositing" | "success" | "error";

export function useRYDDeposit(
  rydAddress: `0x${string}`,
  amountInput: string,
  ytBalance: bigint = BigInt(0)
) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<RYDDepositStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { yt } = useActiveVault();

  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);
  const insufficientBalance = amount > BigInt(0) && amount > ytBalance;

  const deposit = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    if (!yt) {
      setErrorMessage("No active vault");
      setStatus("error");
      return;
    }

    if (amount === BigInt(0)) {
      setErrorMessage("Enter an amount");
      setStatus("error");
      return;
    }

    if (amount > ytBalance) {
      setErrorMessage(
        `Insufficient YT balance. Need ${formatTokenBalance(amount, TOKEN_DECIMALS.USDC)} YT but you only have ${formatTokenBalance(ytBalance, TOKEN_DECIMALS.USDC)} YT.`
      );
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      const allowance = await readContract(config, {
        address: yt,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, rydAddress],
        chainId: baseSepolia.id,
      });

      const needsApproval = allowance < amount;
      setStatus(needsApproval ? "approving" : "depositing");

      const { hash } = await runBatchedWrite(
        [
          needsApproval && {
            address: yt,
            abi: erc20Abi,
            functionName: "approve",
            args: [rydAddress, amount],
          },
          {
            address: rydAddress,
            abi: praxisRYDAbi,
            functionName: "deposit",
            args: [amount],
          },
        ],
        {
          onStep: (index, total) =>
            setStatus(needsApproval && total > 1 && index === 0 ? "approving" : "depositing"),
        },
      );

      if (hash) trackAchievement("ryd.enter", hash);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, rydAddress, amount, ytBalance, writeContractAsync, yt, trackAchievement]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    deposit,
    status,
    errorMessage,
    reset,
    insufficientBalance,
    isPending: status === "approving" || status === "depositing",
  };
}

// ── Withdraw YT from RYD ──────────────────────────────────────────────

export type RYDWithdrawStatus = "idle" | "withdrawing" | "success" | "error";

export function useRYDWithdraw(rydAddress: `0x${string}`, amountInput: string) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<RYDWithdrawStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);

  const withdraw = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    if (amount === BigInt(0)) {
      setErrorMessage("Enter an amount");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      setStatus("withdrawing");

      const tx = await writeContractAsync({
        address: rydAddress,
        abi: praxisRYDAbi,
        functionName: "withdraw",
        args: [amount],
        chainId: baseSepolia.id,
      });

      await waitForTransactionReceipt(config, { hash: tx });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, rydAddress, amount, writeContractAsync]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    withdraw,
    status,
    errorMessage,
    reset,
    isPending: status === "withdrawing",
  };
}

// ── Request Draw ──────────────────────────────────────────────────────

export type RequestDrawStatus = "idle" | "requesting" | "success" | "error";

export function useRYDRequestDraw(rydAddress: `0x${string}`) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<RequestDrawStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestDraw = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      setStatus("requesting");

      const tx = await writeContractAsync({
        address: rydAddress,
        abi: praxisRYDAbi,
        functionName: "requestDraw",
        chainId: baseSepolia.id,
      });

      await waitForTransactionReceipt(config, { hash: tx });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, rydAddress, writeContractAsync]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    requestDraw,
    status,
    errorMessage,
    reset,
    isPending: status === "requesting",
  };
}

// ── Resolve Winners ───────────────────────────────────────────────────

export type ResolveWinnersStatus = "idle" | "resolving" | "success" | "error";

export function useRYDResolveWinners(rydAddress: `0x${string}`) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<ResolveWinnersStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resolveWinners = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      setStatus("resolving");

      const tx = await writeContractAsync({
        address: rydAddress,
        abi: praxisRYDAbi,
        functionName: "resolveWinners",
        chainId: baseSepolia.id,
      });

      await waitForTransactionReceipt(config, { hash: tx });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, rydAddress, writeContractAsync]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    resolveWinners,
    status,
    errorMessage,
    reset,
    isPending: status === "resolving",
  };
}

// ── Claim Prize ───────────────────────────────────────────────────────

export type ClaimPrizeStatus = "idle" | "claiming" | "success" | "error";

export function useRYDClaim(rydAddress: `0x${string}`) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<ClaimPrizeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const claim = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      setStatus("claiming");

      const tx = await writeContractAsync({
        address: rydAddress,
        abi: praxisRYDAbi,
        functionName: "claim",
        chainId: baseSepolia.id,
      });

      await waitForTransactionReceipt(config, { hash: tx });

      trackAchievement("ryd.claim", tx);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, rydAddress, writeContractAsync, trackAchievement]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    claim,
    status,
    errorMessage,
    reset,
    isPending: status === "claiming",
  };
}

// ── On-chain Read Hooks ───────────────────────────────────────────────

export function useRYDOnChainState(rydAddress: `0x${string}`) {
  const { address } = useAccount();

  const { data: rydState } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "state",
    chainId: baseSepolia.id,
  });

  const { data: endTime } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "endTime",
    chainId: baseSepolia.id,
  });

  const { data: totalDeposits } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "totalDeposits",
    chainId: baseSepolia.id,
  });

  const { data: activeParticipants } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "activeParticipants",
    chainId: baseSepolia.id,
  });

  const { data: numWinners } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "numWinners",
    chainId: baseSepolia.id,
  });

  const { data: minDeposit } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "minDeposit",
    chainId: baseSepolia.id,
  });

  const { data: prizePerWinner } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "prizePerWinner",
    chainId: baseSepolia.id,
  });

  const { data: userDeposit } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "deposits",
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address },
  });

  const { data: userIsWinner } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "isWinner",
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address },
  });

  const { data: userHasClaimed } = useReadContract({
    address: rydAddress,
    abi: praxisRYDAbi,
    functionName: "hasClaimed",
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address },
  });

  const stateLabels = ["Open", "DrawRequested", "ReadyToResolve", "Finished"] as const;
  const stateLabel = rydState !== undefined ? stateLabels[rydState] : undefined;

  return {
    state: rydState,
    stateLabel,
    endTime: endTime ?? BigInt(0),
    totalDeposits: totalDeposits ?? BigInt(0),
    activeParticipants: activeParticipants ?? BigInt(0),
    numWinners: numWinners ?? BigInt(0),
    minDeposit: minDeposit ?? BigInt(0),
    prizePerWinner: prizePerWinner ?? BigInt(0),
    userDeposit: userDeposit ?? BigInt(0),
    userIsWinner: userIsWinner ?? false,
    userHasClaimed: userHasClaimed ?? false,
    totalDepositsFormatted: formatTokenBalance(totalDeposits ?? BigInt(0), TOKEN_DECIMALS.USDC),
    minDepositFormatted: formatTokenBalance(minDeposit ?? BigInt(0), TOKEN_DECIMALS.USDC),
    prizePerWinnerFormatted: formatTokenBalance(prizePerWinner ?? BigInt(0), TOKEN_DECIMALS.USDC),
    userDepositFormatted: formatTokenBalance(userDeposit ?? BigInt(0), TOKEN_DECIMALS.USDC),
  };
}
