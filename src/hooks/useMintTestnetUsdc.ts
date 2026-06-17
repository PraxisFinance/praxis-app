"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config/wagmi";
import { mockUsdcAbi } from "@/config/contracts";
import { TOKEN_ADDRESSES } from "@/config/tokens";
import { ensureAppChain } from "@/lib/ensureAppChain";
import { useAuth } from "./useAuth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export type MintTestnetStatus = "idle" | "signing" | "minting" | "success" | "error";

export function useMintTestnetUsdc(onSuccess?: () => void) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { getToken } = useAuth();
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
      setStatus("signing");

      await ensureAppChain(chainId, switchChainAsync);

      // Authenticate and obtain a backend EIP-712 signature.
      const token = await getToken();

      const res = await fetch(`${BACKEND_URL}/faucet/sign`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(body.message ?? "Failed to get faucet signature");
      }

      const { deadline, signature } = (await res.json()) as {
        deadline: string;
        signature: `0x${string}`;
      };

      setStatus("minting");

      const tx = await writeContractAsync({
        address: TOKEN_ADDRESSES.USDC,
        abi: mockUsdcAbi,
        functionName: "claim",
        args: [BigInt(deadline), signature],
      });

      await waitForTransactionReceipt(config, { hash: tx });

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, writeContractAsync, getToken, onSuccess]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    mint,
    status,
    errorMessage,
    reset,
    isPending: status === "signing" || status === "minting",
  };
}
