"use client";

import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  applyAchievementCheckResult,
  postAchievementCheck,
} from "@/hooks/progress/achievementCheck";
import { showAchievementCheckToasts } from "@/hooks/progress/achievementCheckToasts";
import { canUseAuthenticatedApi, resolveAuthAddress } from "@/lib/auth/devAuthToken";
import type { AchievementTrigger } from "@/shared/types/api";

/**
 * Lightweight fire-and-forget achievement tracker.
 * Designed to be used inside transaction hooks — never throws, never blocks.
 */
export function useTrackAchievement() {
  const { address } = useAccount();
  const authAddress = resolveAuthAddress(address);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const trackAchievement = useCallback(
    (trigger: AchievementTrigger, txHash?: string): void => {
      if (!canUseAuthenticatedApi(address)) return;

      void (async () => {
        try {
          const token = await getToken();
          const result = await postAchievementCheck(token, {
            trigger,
            payload: txHash ? { txHash } : {},
          });

          applyAchievementCheckResult(queryClient, authAddress, result);
          showAchievementCheckToasts(result);
        } catch {
          // Achievement tracking must never interrupt the main UX flow
        }
      })();
    },
    [address, authAddress, getToken, queryClient],
  );

  return { trackAchievement };
}
