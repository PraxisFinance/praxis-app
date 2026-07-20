"use client";

import { useState, useCallback } from "react";
import { useAccount, useChainId, useReadContract, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { baseSepolia } from "wagmi/chains";
import { config } from "@/config/wagmi";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/config/tokens";
import { praxisVaultAbi } from "@/config/contracts";
import { parseTokenAmount, formatTokenBalance } from "@/shared/utils/format";
import { runBatchedWrite } from "@/lib/batchedWrite";
import { useTrackAchievement } from "./useTrackAchievement";

// ── Deposit ───────────────────────────────────────────────────────────

export type DepositStatus = "idle" | "approving" | "depositing" | "success" | "error";

export function useVaultDeposit(
  vaultAddress: `0x${string}`,
  amountInput: string,
  usdcBalance: bigint = BigInt(0)
) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<DepositStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const principalAmount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);

  const { data: buyInRaw } = useReadContract({
    address: vaultAddress,
    abi: praxisVaultAbi,
    functionName: "quoteBuyIn",
    args: [principalAmount],
    chainId: baseSepolia.id,
    query: { enabled: principalAmount > BigInt(0) },
  });

  const buyIn = buyInRaw ?? BigInt(0);
  const buyInFormatted = formatTokenBalance(buyIn, TOKEN_DECIMALS.USDC);

  const maxBuyIn = buyIn + buyIn / BigInt(100);
  const totalCost = principalAmount + maxBuyIn;
  const totalCostFormatted = formatTokenBalance(totalCost, TOKEN_DECIMALS.USDC);

  const insufficientBalance = principalAmount > BigInt(0) && totalCost > usdcBalance;

  const deposit = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    if (principalAmount === BigInt(0)) {
      setErrorMessage("Enter an amount");
      setStatus("error");
      return;
    }

    if (totalCost > usdcBalance) {
      setErrorMessage(
        `Insufficient balance. Deposit (${formatTokenBalance(principalAmount, TOKEN_DECIMALS.USDC)}) + buy-in fee (${buyInFormatted}) = ${totalCostFormatted} USDC, but you only have ${formatTokenBalance(usdcBalance, TOKEN_DECIMALS.USDC)} USDC.`
      );
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      const allowance = await readContract(config, {
        address: TOKEN_ADDRESSES.USDC,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, vaultAddress],
        chainId: baseSepolia.id,
      });

      const needsApproval = allowance < totalCost;
      setStatus(needsApproval ? "approving" : "depositing");

      const { hash } = await runBatchedWrite(
        [
          needsApproval && {
            address: TOKEN_ADDRESSES.USDC,
            abi: erc20Abi,
            functionName: "approve",
            args: [vaultAddress, totalCost],
          },
          {
            address: vaultAddress,
            abi: praxisVaultAbi,
            functionName: "deposit",
            args: [principalAmount, address, maxBuyIn],
          },
        ],
        {
          onStep: (index, total) =>
            setStatus(needsApproval && total > 1 && index === 0 ? "approving" : "depositing"),
        },
      );

      if (hash) trackAchievement("vault.deposit", hash);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [
    address,
    chainId,
    switchChainAsync,
    vaultAddress,
    principalAmount,
    maxBuyIn,
    totalCost,
    usdcBalance,
    buyInFormatted,
    totalCostFormatted,
    writeContractAsync,
    trackAchievement,
  ]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    deposit,
    status,
    errorMessage,
    reset,
    buyIn: buyInFormatted,
    totalCost: totalCostFormatted,
    insufficientBalance,
    isPending: status === "approving" || status === "depositing",
  };
}

// ── Withdraw ──────────────────────────────────────────────────────────

export type WithdrawStatus = "idle" | "withdrawing" | "success" | "error";

export function useVaultWithdraw(vaultAddress: `0x${string}`, amountInput: string) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<WithdrawStatus>("idle");
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
        address: vaultAddress,
        abi: praxisVaultAbi,
        functionName: "withdraw",
        args: [amount, address],
        chainId: baseSepolia.id,
      });

      await waitForTransactionReceipt(config, { hash: tx });

      trackAchievement("vault.withdraw", tx);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, vaultAddress, amount, writeContractAsync, trackAchievement]);

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

// ── Redeem Yield ──────────────────────────────────────────────────────

export type RedeemYieldStatus = "idle" | "redeeming" | "success" | "error";

export function useVaultRedeemYield(vaultAddress: `0x${string}`, ytAmountInput: string) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<RedeemYieldStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ytAmount = parseTokenAmount(ytAmountInput, TOKEN_DECIMALS.USDC);

  const redeemYield = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    if (ytAmount === BigInt(0)) {
      setErrorMessage("Enter an amount");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await switchChainAsync({ chainId: baseSepolia.id });

      setStatus("redeeming");

      const tx = await writeContractAsync({
        address: vaultAddress,
        abi: praxisVaultAbi,
        functionName: "redeemYield",
        args: [ytAmount, address],
        chainId: baseSepolia.id,
      });

      await waitForTransactionReceipt(config, { hash: tx });

      trackAchievement("vault.withdraw", tx);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, vaultAddress, ytAmount, writeContractAsync, trackAchievement]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    redeemYield,
    status,
    errorMessage,
    reset,
    isPending: status === "redeeming",
  };
}

// ── Claim Both (batched) ───────────────────────────────────────────────

export type ClaimBothStatus = "idle" | "claiming" | "success" | "error";

interface ClaimBothOptions {
  principal: boolean;
  yield: boolean;
}

export function useVaultClaimBoth(
  vaultAddress: `0x${string}`,
  principalAmountInput: string,
  yieldAmountInput: string
) {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [status, setStatus] = useState<ClaimBothStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ptAmount = parseTokenAmount(principalAmountInput, TOKEN_DECIMALS.USDC);
  const ytAmount = parseTokenAmount(yieldAmountInput, TOKEN_DECIMALS.USDC);

  const claim = useCallback(
    async (opts: ClaimBothOptions) => {
      if (!address) {
        setErrorMessage("Wallet not connected");
        setStatus("error");
        return;
      }

      const wantPrincipal = opts.principal && ptAmount > BigInt(0);
      const wantYield = opts.yield && ytAmount > BigInt(0);

      if (!wantPrincipal && !wantYield) return;

      try {
        setErrorMessage(null);
        await switchChainAsync({ chainId: baseSepolia.id });
        setStatus("claiming");

        await runBatchedWrite([
          wantPrincipal && {
            address: vaultAddress,
            abi: praxisVaultAbi,
            functionName: "withdraw",
            args: [ptAmount, address],
          },
          wantYield && {
            address: vaultAddress,
            abi: praxisVaultAbi,
            functionName: "redeemYield",
            args: [ytAmount, address],
          },
        ]);

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
      }
    },
    [address, switchChainAsync, vaultAddress, ptAmount, ytAmount]
  );

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
