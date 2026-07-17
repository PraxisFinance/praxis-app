"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";

/**
 * Ensures SIWE auth runs as soon as a wallet is connected when there is no
 * valid stored token, or the stored token belongs to a different address.
 * `getToken()` is a no-op (localStorage hit) when the session is already valid.
 */
export function AuthBoot() {
  const { address, status } = useAccount();
  const { getToken } = useAuth();
  const attemptedFor = useRef<string | null>(null);

  useEffect(() => {
    if (status === "disconnected") {
      attemptedFor.current = null;
      return;
    }

    if (status !== "connected" || !address) return;

    const key = address.toLowerCase();
    if (attemptedFor.current === key) return;
    attemptedFor.current = key;

    void getToken().catch(() => {
      // Allow a later retry (e.g. user rejected the signature prompt).
      if (attemptedFor.current === key) {
        attemptedFor.current = null;
      }
    });
  }, [address, status, getToken]);

  return null;
}
