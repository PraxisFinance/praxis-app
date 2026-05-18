"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config/wagmi";
import { testnetMintAbi } from "@/config/contracts";
import { TOKEN_ADDRESSES } from "@/config/tokens";
import { ensureAppChain } from "@/lib/ensureAppChain";

const MINT_AMOUNT = BigInt(100 * 10 ** 6);

export type MintTestnetStatus = "idle" | "minting" | "success" | "error";

export function useMintTestnetUsdc(onSuccess?: () => void) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<MintTestnetStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mint = useCallback(async () => {
    if (!address) {
      setErrorMessage("Wallet not connected");
      setStatus("error");
      return;
    }

    try {
      setErrorMessage(null);
      setStatus("minting");

      await ensureAppChain(chainId, switchChainAsync);

      const tx = await writeContractAsync({
        address: TOKEN_ADDRESSES.USDC,
        abi: testnetMintAbi,
        functionName: "mint",
        args: [address, MINT_AMOUNT],
      });

      await waitForTransactionReceipt(config, { hash: tx });

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, writeContractAsync, onSuccess]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    mint,
    status,
    errorMessage,
    reset,
    isPending: status === "minting",
  };
}
