"use client";

import { useState, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/config/wagmi";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS, VAULT_ADDRESS } from "@/config/tokens";
import { praxisVaultAbi } from "@/config/contracts";
import { parseTokenAmount, formatTokenBalance } from "@/shared/utils/format";

export type DepositStatus =
  | "idle"
  | "approving"
  | "depositing"
  | "success"
  | "error";

export function useVaultDeposit(amountInput: string) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<DepositStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const principalAmount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);

  const { data: buyInRaw } = useReadContract({
    address: VAULT_ADDRESS,
    abi: praxisVaultAbi,
    functionName: "quoteBuyIn",
    args: [principalAmount],
    query: { enabled: principalAmount > BigInt(0) },
  });

  const buyIn = buyInRaw ?? BigInt(0);
  const buyInFormatted = formatTokenBalance(buyIn, TOKEN_DECIMALS.USDC);

  const maxBuyIn = buyIn + buyIn / BigInt(100); // 1% slippage buffer
  const totalCost = principalAmount + maxBuyIn;
  const totalCostFormatted = formatTokenBalance(totalCost, TOKEN_DECIMALS.USDC);

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

    try {
      setErrorMessage(null);

      const allowance = await readContract(config, {
        address: TOKEN_ADDRESSES.USDC,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, VAULT_ADDRESS],
      });

      if (allowance < totalCost) {
        setStatus("approving");

        const approveTx = await writeContractAsync({
          address: TOKEN_ADDRESSES.USDC,
          abi: erc20Abi,
          functionName: "approve",
          args: [VAULT_ADDRESS, totalCost],
        });

        await waitForTransactionReceipt(config, { hash: approveTx });
      }

      setStatus("depositing");

      const depositTx = await writeContractAsync({
        address: VAULT_ADDRESS,
        abi: praxisVaultAbi,
        functionName: "deposit",
        args: [principalAmount, address, maxBuyIn],
      });

      await waitForTransactionReceipt(config, { hash: depositTx });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Transaction failed"
      );
    }
  }, [address, principalAmount, maxBuyIn, totalCost, writeContractAsync]);

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
    isPending: status === "approving" || status === "depositing",
  };
}
