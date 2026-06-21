"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSignTypedData } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { useReferralsStore } from "@/stores/referralsStore";
import type { BindParams, BindResult, ReferralStats, ReferrerInfo } from "@/shared/types/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

/** EIP-712 type definition that mirrors the contract's REGISTER_REFERRER_TYPEHASH. */
const REGISTER_REFERRER_TYPES = {
  RegisterReferrer: [
    { name: "trader", type: "address" },
    { name: "referrer", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

export type BindStatus = "idle" | "fetching-params" | "signing" | "binding" | "success" | "error";

async function parseApiError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as { message?: string };
    return new Error(body.message ?? res.statusText);
  } catch {
    return new Error(res.statusText);
  }
}

export function useReferral() {
  const { address } = useAccount();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { signTypedDataAsync } = useSignTypedData();
  const populate = useReferralsStore((s) => s.populate);

  const [bindStatus, setBindStatus] = useState<BindStatus>("idle");
  const [bindError, setBindError] = useState<string | null>(null);

  const statsQuery = useQuery<ReferralStats, Error>({
    queryKey: ["referral-stats", address],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/referrals/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await parseApiError(res);
      return res.json() as Promise<ReferralStats>;
    },
    enabled: !!address,
  });

  useEffect(() => {
    if (statsQuery.data) populate(statsQuery.data);
  }, [statsQuery.data, populate]);

  const referrerQuery = useQuery<ReferrerInfo, Error>({
    queryKey: ["referral-referrer", address],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/referrals/referrer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await parseApiError(res);
      return res.json() as Promise<ReferrerInfo>;
    },
    enabled: !!address,
  });

  /**
   * Three-phase atomic bind:
   *  1. GET /referrals/bind-params?code=:code  — backend resolves referrer address
   *     and reads the current on-chain nonce, returning everything needed to sign.
   *  2. signTypedData (EIP-712, gasless) — user signs in wallet, no gas needed.
   *  3. POST /referrals/bind { code, signature, deadline } — backend verifies the
   *     signature, calls registerReferrerFor on-chain (REGISTRAR_ROLE), and records
   *     the off-chain bind atomically.
   *
   * If Phase 3 returns 400 (deadline expired — user took > 10 min), Phase 1 is
   * automatically re-fetched and the user is prompted to sign again (one retry).
   */
  const bindCode = useCallback(
    async (code: string, isRetry = false): Promise<BindResult | null> => {
      if (!address) return null;

      setBindError(null);
      setBindStatus("fetching-params");

      try {
        // Phase 1: resolve bind params
        const token = await getToken();
        const paramsRes = await fetch(
          `${BACKEND_URL}/referrals/bind-params?code=${encodeURIComponent(code)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!paramsRes.ok) {
          if (paramsRes.status === 404) {
            setBindError("Referral code not found.");
            setBindStatus("error");
            return null;
          }
          if (paramsRes.status === 400) {
            setBindError("You cannot use your own referral code.");
            setBindStatus("error");
            return null;
          }
          if (paramsRes.status === 409) {
            setBindError("You have already been referred by someone.");
            setBindStatus("error");
            return null;
          }
          throw await parseApiError(paramsRes);
        }

        const params = (await paramsRes.json()) as BindParams;

        // Phase 2: EIP-712 signature — gasless, user approves in wallet
        setBindStatus("signing");
        const signature = await signTypedDataAsync({
          domain: {
            name: "PraxisFeeRouter",
            version: "1",
            chainId: params.chainId,
            verifyingContract: params.feeRouterAddress as `0x${string}`,
          },
          types: REGISTER_REFERRER_TYPES,
          primaryType: "RegisterReferrer",
          message: {
            trader: address,
            referrer: params.referrerAddress as `0x${string}`,
            nonce: BigInt(params.nonce),   // never parseInt — nonce is a stringified bigint
            deadline: BigInt(params.deadline),
          },
        });

        // Phase 3: backend verifies sig, registers on-chain, records off-chain bind
        // deadline must be the exact value from Phase 1 — backend verifies against it
        setBindStatus("binding");
        const bindRes = await fetch(`${BACKEND_URL}/referrals/bind`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code, signature, deadline: params.deadline }),
        });

        if (!bindRes.ok) {
          if (bindRes.status === 409) {
            setBindError("You have already been referred by someone.");
            setBindStatus("error");
            return null;
          }
          if (bindRes.status === 400 && !isRetry) {
            // Deadline expired (user took > 10 min) — re-fetch params and re-sign once
            return bindCode(code, true);
          }
          throw await parseApiError(bindRes);
        }

        const result = (await bindRes.json()) as BindResult;

        queryClient.setQueryData<ReferrerInfo>(["referral-referrer", address], {
          referrer: result.referrer,
          status: result.status,
        });

        setBindStatus("success");
        return result;
      } catch (err) {
        const message =
          err instanceof Error && err.message.toLowerCase().includes("user rejected")
            ? "Signature rejected. Please try again."
            : err instanceof Error
              ? err.message
              : "Bind failed. Please try again.";
        setBindError(message);
        setBindStatus("error");
        return null;
      }
    },
    [address, getToken, queryClient, signTypedDataAsync],
  );

  const resetBind = useCallback(() => {
    setBindStatus("idle");
    setBindError(null);
  }, []);

  const refreshStats = useCallback(async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: ["referral-stats", address] });
  }, [address, queryClient]);

  return {
    stats: statsQuery.data ?? null,
    referrerInfo: referrerQuery.data ?? null,

    statsLoading: statsQuery.isLoading,
    referrerLoading: referrerQuery.isLoading,

    statsError: statsQuery.error,
    referrerError: referrerQuery.error,

    bindStatus,
    bindError,
    bindCode,
    resetBind,
    refreshStats,
  };
}
