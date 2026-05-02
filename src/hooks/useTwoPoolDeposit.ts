"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { erc20Abi } from "viem";
import { config } from "@/config/wagmi";
import { twoPoolAbi } from "@/config/contracts";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from "@/config/tokens";
import { parseTokenAmount } from "@/shared/utils/format";
import type { TwoPool, TwoPoolSide } from "@/shared/types/twoPool";
import { ensureAppChain } from "@/lib/ensureAppChain";

export type TwoPoolDepositStatus = "idle" | "approving" | "depositing" | "success" | "error";

function sideToUint8(side: TwoPoolSide): 0 | 1 {
  return side === "stable" ? 0 : 1;
}

export function useTwoPoolDeposit(pool: TwoPool, side: TwoPoolSide, amountInput: string) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<TwoPoolDepositStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const poolAddress = pool.id as `0x${string}`;
  const amount = parseTokenAmount(amountInput, TOKEN_DECIMALS.USDC);

  const deposit = useCallback(async () => {
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

      await ensureAppChain(chainId, switchChainAsync);

      const allowance = await readContract(config, {
        address: TOKEN_ADDRESSES.YT,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, poolAddress],
      });

      if (allowance < amount) {
        setStatus("approving");
        const approveTx = await writeContractAsync({
          address: TOKEN_ADDRESSES.YT,
          abi: erc20Abi,
          functionName: "approve",
          args: [poolAddress, amount],
        });
        await waitForTransactionReceipt(config, { hash: approveTx });
      }

      setStatus("depositing");

      const depositTx = await writeContractAsync({
        address: poolAddress,
        abi: twoPoolAbi,
        functionName: "deposit",
        args: [sideToUint8(side), amount],
      });

      await waitForTransactionReceipt(config, { hash: depositTx });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, amount, chainId, poolAddress, side, switchChainAsync, writeContractAsync]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    deposit,
    status,
    errorMessage,
    reset,
    isPending: status === "approving" || status === "depositing",
  };
}
