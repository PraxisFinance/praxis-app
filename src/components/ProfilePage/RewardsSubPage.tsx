"use client";

import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { Balances } from "../Balances/Balances";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useClaimsStore } from "@/stores/claimsStore";
import { useClaimAll } from "@/hooks/useClaimAll";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { ClaimableRewardRow } from "./ClaimableRewardRow";

export function RewardsSubPage() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const claims = useClaimsStore((s) => s.claims);
  const markClaimed = useClaimsStore((s) => s.markClaimed);
  const historyLoaded = useStatisticsStore((s) => s.historyLoaded);
  const isLoading = Boolean(address) && !historyLoaded;

  const pendingClaims = useMemo(
    () => claims.filter((c) => c.status === "pending"),
    [claims]
  );

  const { claimAll, isPending: isClaimingAll, errorMessage: claimAllError } =
    useClaimAll(pendingClaims);

  const invalidateHistory = useCallback(() => {
    if (address) {
      void queryClient.invalidateQueries({ queryKey: ["userHistory", address] });
    }
  }, [queryClient, address]);

  const handleSuccess = useCallback(
    (id: string) => {
      markClaimed(id);
      invalidateHistory();
    },
    [markClaimed, invalidateHistory]
  );

  const handleClaimAll = useCallback(async () => {
    const claimedIds = await claimAll();
    for (const id of claimedIds) markClaimed(id);
    if (claimedIds.length > 0) invalidateHistory();
  }, [claimAll, markClaimed, invalidateHistory]);

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <SectionHeader>Claims</SectionHeader>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            <PageSkeleton variant="list" rows={3} />
          ) : pendingClaims.length > 0 ? (
            pendingClaims.map((claim) => (
              <ClaimableRewardRow key={claim.id} claim={claim} onSuccess={handleSuccess} />
            ))
          ) : (
            <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
              No unclaimed rewards.
            </p>
          )}
        </div>

        {claimAllError && (
          <p className="text-xs text-red-500 text-center">{claimAllError}</p>
        )}

        {!isLoading && pendingClaims.length > 0 && (
          <Button
            variant="primary"
            size="action"
            onClick={() => void handleClaimAll()}
            disabled={isClaimingAll}
            className="mt-1"
          >
            {isClaimingAll ? "Claiming…" : "Claim all"}
          </Button>
        )}
      </section>
    </div>
  );
}
