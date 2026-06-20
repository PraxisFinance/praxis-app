"use client";

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import type { ReferralStats, ReferrerInfo, BindResult } from "@/shared/types/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

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

  const bindCode = useCallback(
    async (code: string): Promise<BindResult | null> => {
      setBindError(null);
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/referrals/bind`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          // Already referred — surface as field-level error, do not throw
          setBindError("You have already been referred by someone.");
          return null;
        }
        throw await parseApiError(res);
      }

      const result = (await res.json()) as BindResult;

      // Update referrer info in cache with the bound referrer details
      queryClient.setQueryData<ReferrerInfo>(["referral-referrer", address], {
        referrer: result.referrer,
        status: result.status,
      });

      return result;
    },
    [address, getToken, queryClient]
  );

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
    bindError,

    bindCode,
    refreshStats,
  };
}
