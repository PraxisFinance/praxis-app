"use client";

import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type {
  AchievementTrigger,
  CheckResult,
  UserAchievementsResponse,
} from "@/shared/types/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

/**
 * Lightweight fire-and-forget achievement tracker.
 * Designed to be used inside transaction hooks — never throws, never blocks.
 */
export function useTrackAchievement() {
  const { address } = useAccount();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const trackAchievement = useCallback(
    (trigger: AchievementTrigger, txHash?: string): void => {
      if (!address) return;

      void (async () => {
        try {
          const token = await getToken();
          const res = await fetch(`${BACKEND_URL}/achievements/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              trigger,
              payload: txHash ? { txHash } : {},
            }),
          });

          if (!res.ok) return;

          const result = (await res.json()) as CheckResult;

          // Merge updated achievements into the cached user data
          queryClient.setQueryData<UserAchievementsResponse>(
            ["achievements-me", address],
            (prev) => {
              if (!prev) return prev;
              const updatedById = new Map(result.updated.map((a) => [a.id, a]));
              return {
                achievements: prev.achievements.map((a) =>
                  updatedById.has(a.id) ? updatedById.get(a.id)! : a
                ),
                totalXp: prev.totalXp + result.xpGained,
              };
            }
          );

          // Use updated[] for rich titles/XP rather than a separate catalogue lookup
          if (result.newlyCompleted.length > 0) {
            for (const id of result.newlyCompleted) {
              const a = result.updated.find((u) => u.id === id);
              toast.success(a?.title ?? "Achievement unlocked!", {
                description: a
                  ? `${a.description}${a.xpAwarded > 0 ? ` · +${a.xpAwarded} XP` : ""}`
                  : undefined,
              });
            }
          } else if (result.xpGained > 0) {
            toast.success(`+${result.xpGained} XP earned`);
          }
        } catch {
          // Achievement tracking must never interrupt the main UX flow
        }
      })();
    },
    [address, getToken, queryClient]
  );

  return { trackAchievement };
}
