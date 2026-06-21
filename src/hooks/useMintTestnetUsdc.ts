"use client";

import { useCallback, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { getBalance, waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@/config/wagmi";
import { mockUsdcAbi } from "@/config/contracts";
import { TOKEN_ADDRESSES } from "@/config/tokens";
import { APP_CHAIN_ID, ensureAppChain } from "@/lib/ensureAppChain";
import { useAuth } from "./useAuth";
import { useTrackAchievement } from "./useTrackAchievement";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

// Minimum native balance (wei) the wallet needs to cover gas for the claim tx.
// Below this we ask the backend gas faucet to top the wallet up first.
const MIN_GAS_WEI = BigInt(100_000_000_000_000); // 0.0001 ETH

export type MintTestnetStatus =
  | "idle"
  | "funding"
  | "signing"
  | "minting"
  | "success"
  | "error";

export function useMintTestnetUsdc(onSuccess?: () => void) {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { getToken } = useAuth();
  const { trackAchievement } = useTrackAchievement();
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

      await ensureAppChain(chainId, switchChainAsync);

      // The claim tx below needs native ETH for gas. A fresh wallet has none,
      // so top it up via the (no-auth) backend gas faucet before anything that
      // would otherwise open the wallet and fail. The faucet endpoint resolves
      // only once the funding tx is confirmed on-chain.
      const { value: nativeBalance } = await getBalance(config, {
        address,
        chainId: APP_CHAIN_ID,
      });

      if (nativeBalance < MIN_GAS_WEI) {
        setStatus("funding");

        const fundRes = await fetch(`${BACKEND_URL}/faucet/eth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });

        if (!fundRes.ok) {
          const body = (await fundRes.json().catch(() => ({}))) as { message?: string };
          throw new Error(body.message ?? "Failed to fund wallet with gas");
        }
      }

      setStatus("signing");

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

      trackAchievement("funds.claim");
      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transaction failed");
    }
  }, [address, chainId, switchChainAsync, writeContractAsync, getToken, onSuccess, trackAchievement]);

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return {
    mint,
    status,
    errorMessage,
    reset,
    isPending: status === "funding" || status === "signing" || status === "minting",
  };
}
