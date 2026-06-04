"use client";

import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { RandomPoolEnded } from "@/shared/types/randomPool";

interface RandomRewardDetailEndedSectionProps {
  pool: RandomPoolEnded;
  onClaim?: () => void;
}

export function RandomRewardDetailEndedSection({
  pool,
  onClaim,
}: RandomRewardDetailEndedSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">
        Your rewards
      </SectionHeader>
      {pool.userWon ? (
        <>
          <p className="text-main-darkPurple text-sm leading-snug">
            Congratulations! You are among the winners — you can claim your rewards now.
          </p>
          <Button type="button" variant="primary" size="action" onClick={onClaim}>
            Claim rewards
          </Button>
        </>
      ) : (
        <div className="bg-main-lightGray text-main-darkPurple flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm leading-snug">
          <Frown className="text-main-purple mt-0.5 size-5 shrink-0" strokeWidth={2} aria-hidden />
          <span>Unfortunately you lost, try again in next pools!</span>
        </div>
      )}
    </section>
  );
}
