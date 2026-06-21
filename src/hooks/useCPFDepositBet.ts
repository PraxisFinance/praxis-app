"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/config/wagmi";
import { praxisCPFAbi } from "@/config/contracts";
import { TOKEN_DECIMALS } from "@/config/tokens";
import { useActiveVault } from "@/stores/activeVaultStore";
import { parseTokenAmount } from "@/shared/utils/format";
import { ensureAppChain } from "@/lib/ensureAppChain";
import { useTrackAchievement } from "./useTrackAchievement";

export type CPFDepositBetStatus = "idle" | "approving" | "depositing" | "success" | "error";

export function useCPFDepositBet(
  cpfAddress: `0x${string}`,
  cpfPoolId: bigint,
  amountInput: string,
  inFavor: boolean,
  minTokensOut: bigint = 0n,
) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { trackAchievement } = useTrackAchievement();
  const [status, setStatus] = useState<CPFDepositBetStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { yt } = useActiveVault();
  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);

  const placeBet = useCallback(async () => {
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

    if (!cpfAddress) {
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
        args: [address, cpfAddress],
      });

      if (allowance < amount) {
        setStatus("approving");
        const approveTx = await writeContractAsync({
          address: yt,
          abi: erc20Abi,
          functionName: "approve",
          args: [cpfAddress, amount],
        });
        await waitForTransactionReceipt(config, { hash: approveTx });
      }

      setStatus("depositing");

      const betTx = await writeContractAsync({
        address: cpfAddress,
        abi: praxisCPFAbi,
        functionName: "buy",
        args: [cpfPoolId, amount, inFavor, minTokensOut],
      });

      await waitForTransactionReceipt(config, { hash: betTx });

      trackAchievement("cpf.predict", betTx);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, cpfAddress, cpfPoolId, amount, inFavor, minTokensOut, switchChainAsync, writeContractAsync, yt, trackAchievement]);

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
