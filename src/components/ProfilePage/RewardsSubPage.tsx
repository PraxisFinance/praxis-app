"use client";

import { useMemo } from "react";
import { Balances } from "../Balances/Balances";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useClaimsStore } from "@/stores/claimsStore";
import { claimToRewardClaimItem } from "./claimDisplayMapper";
import { RewardClaimRow } from "./RewardClaimRow";

export function RewardsSubPage() {
  const claims = useClaimsStore((s) => s.claims);

  const pendingRewards = useMemo(
    () => claims.filter((c) => c.status === "pending").map(claimToRewardClaimItem),
    [claims]
  );

  function handleClaim(id: string) {
    console.log("claim", id);
  }

  function handleClaimAll() {
    console.log("claim all");
  }

  return (
    <div className="flex flex-col gap-6">
      <Balances />

      <section className="flex flex-col gap-3">
        <SectionHeader>Claims</SectionHeader>

        <div className="flex flex-col gap-2">
          {pendingRewards.length > 0 ? (
            pendingRewards.map((item) => (
              <RewardClaimRow key={item.id} item={item} onClaim={handleClaim} />
            ))
          ) : (
            <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
              No unclaimed rewards.
            </p>
          )}
        </div>

        {pendingRewards.length > 0 ? (
          <Button variant="primary" size="action" onClick={handleClaimAll} className="mt-1">
            Claim all
          </Button>
        ) : null}
      </section>
    </div>
  );
}
