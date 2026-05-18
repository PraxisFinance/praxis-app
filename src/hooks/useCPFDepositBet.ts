"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/config/wagmi";
import { CPF_ADDRESS, praxisCPFAbi } from "@/config/contracts";
import { TOKEN_DECIMALS } from "@/config/tokens";
import { useActiveVault } from "@/stores/activeVaultStore";
import { parseTokenAmount } from "@/shared/utils/format";
import { ensureAppChain } from "@/lib/ensureAppChain";

export type CPFDepositBetStatus = "idle" | "approving" | "depositing" | "success" | "error";

export function useCPFDepositBet(cpfPoolId: bigint, amountInput: string, inFavor: boolean) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<CPFDepositBetStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { yt } = useActiveVault();
  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.YT);

  const placeBet = useCallback(async () => {
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

    if (!CPF_ADDRESS) {
      setErrorMessage("Contract address not configured");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);

      await ensureAppChain(chainId, switchChainAsync);

      const allowance = await readContract(config, {
        address: yt,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, CPF_ADDRESS],
      });

      if (allowance < amount) {
        setStatus("approving");
        const approveTx = await writeContractAsync({
          address: yt,
          abi: erc20Abi,
          functionName: "approve",
          args: [CPF_ADDRESS, amount],
        });
        await waitForTransactionReceipt(config, { hash: approveTx });
      }

      setStatus("depositing");

      const betTx = await writeContractAsync({
        address: CPF_ADDRESS,
        abi: praxisCPFAbi,
        functionName: "depositBet",
        args: [cpfPoolId, amount, inFavor],
      });

      await waitForTransactionReceipt(config, { hash: betTx });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, cpfPoolId, amount, inFavor, switchChainAsync, writeContractAsync, yt]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    placeBet,
    status,
    errorMessage,
    reset,
    isPending: status === "approving" || status === "depositing",
  };
}
