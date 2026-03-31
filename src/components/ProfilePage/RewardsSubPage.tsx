"use client";

import Image from "next/image";
import { Balances } from "../Balances/Balances";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { RewardClaimItem } from "@/shared/types/profile";
import { REWARDS_CLAIMS_MOCK } from "@/shared/constants/profile";

interface RewardClaimRowProps {
  item: RewardClaimItem;
  onClaim: (id: string) => void;
}

function RewardClaimRow({ item, onClaim }: RewardClaimRowProps) {
  return (
    <div className="flex items-center gap-3 bg-main-lightGray rounded-sm px-3.5 py-3">
      <Image src={item.iconUrl} alt={item.name} width={24} height={24} className="shrink-0" />

      <span className="flex-1 text-main-darkPurple text-xs leading-5 min-w-0 truncate">
        {item.name}
      </span>

      <span className="shrink-0 text-main-darkPurple text-xs leading-5 whitespace-nowrap">
        Income:{" "}
        <span className="text-main-darkPurple font-medium text-xs">
          {item.income} {item.incomeCurrency}
        </span>
      </span>

      <Button variant="primary" size="sm" onClick={() => onClaim(item.id)} className="shrink-0">
        Claim
      </Button>
    </div>
  );
}

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
