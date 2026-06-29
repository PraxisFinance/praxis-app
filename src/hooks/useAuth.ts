"use client";

import { useCallback } from "react";
import { useAccount, useSignMessage, useSwitchChain } from "wagmi";
import { createSiweMessage } from "viem/siwe";
import { baseSepolia } from "wagmi/chains";
import { showAchievementCheckToasts } from "@/hooks/progress/achievementCheckToasts";
import { getDevAuthToken } from "@/lib/auth/devAuthToken";
import { ensureAppChain } from "@/lib/ensureAppChain";
import type { CheckResult } from "@/shared/types/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

const JWT_STORAGE_KEY = "praxis_auth_token";

interface StoredToken {
  token: string;
  expiresAt: number;
  address: string;
}

function getStoredToken(currentAddress: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(JWT_STORAGE_KEY);
    if (!raw) return null;
    const { token, expiresAt, address } = JSON.parse(raw) as StoredToken;
    if (Date.now() > expiresAt || address.toLowerCase() !== currentAddress.toLowerCase()) {
      localStorage.removeItem(JWT_STORAGE_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function storeToken(token: string, address: string): void {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify({ token, expiresAt, address }));
}

async function fireWalletConnectAchievement(token: string): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_URL}/achievements/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ trigger: "wallet.connect", payload: {} }),
    });
    if (!res.ok) return;
    const result = (await res.json()) as CheckResult;
    showAchievementCheckToasts(result);
  } catch {
    // Silently swallow — never break the auth flow
  }
}

export function useAuth() {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const getToken = useCallback(async (): Promise<string> => {
    const devToken = getDevAuthToken();
    if (devToken) return devToken;

    if (!address) throw new Error("Wallet not connected");

    const stored = getStoredToken(address);
    if (stored) return stored;

    await ensureAppChain(chainId, switchChainAsync);

    const nonceRes = await fetch(`${BACKEND_URL}/auth/nonce`);
    if (!nonceRes.ok) throw new Error("Failed to fetch auth nonce");
    const { nonce } = (await nonceRes.json()) as { nonce: string };

    const message = createSiweMessage({
      address,
      chainId: baseSepolia.id,
      domain: window.location.host,
      nonce,
      uri: window.location.origin,
      version: "1",
      statement: "Sign in to Praxis Finance",
    });

    const signature = await signMessageAsync({ message });

    const verifyRes = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    });

    if (!verifyRes.ok) throw new Error("Authentication failed");

    const { accessToken } = (await verifyRes.json()) as { accessToken: string };
    storeToken(accessToken, address);
    void fireWalletConnectAchievement(accessToken);
    return accessToken;
  }, [address, chainId, switchChainAsync, signMessageAsync]);

  const clearToken = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(JWT_STORAGE_KEY);
    }
  }, []);

  return { getToken, clearToken };
}
