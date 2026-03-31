"use client";

import { Balances } from "../Balances/Balances";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RewardClaimRow } from "./RewardClaimRow";
import type { RewardClaimItem } from "@/shared/types/profile";
import { REWARDS_CLAIMS_MOCK } from "@/shared/constants/profile";

interface RewardsSubPageProps {
  claims?: RewardClaimItem[];
}

export function RewardsSubPage({ claims = REWARDS_CLAIMS_MOCK }: RewardsSubPageProps) {
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
          {claims.map((item) => (
            <RewardClaimRow key={item.id} item={item} onClaim={handleClaim} />
          ))}
        </div>

        <Button variant="primary" size="action" onClick={handleClaimAll} className="mt-1">
          Claim all
        </Button>
      </section>
    </div>
  );
}
