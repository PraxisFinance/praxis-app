"use client";

import { Flame } from "lucide-react";
import { HintIcon } from "@/components/icons/base";

interface CryptoPredictionHubDetailOutcomesSectionProps {
  children: React.ReactNode;
}

export function CryptoPredictionHubDetailOutcomesSection({
  children,
}: CryptoPredictionHubDetailOutcomesSectionProps) {
  return (
    <section className="bg-main-lightGray flex flex-col gap-3 rounded-[10px] p-3">
      <div className="flex items-center gap-1.5">
        <Flame className="text-main-purple size-4 shrink-0" aria-hidden />
        <h2 className="text-main-darkPurple text-sm font-medium">Outcomes</h2>
        <button
          type="button"
          className="text-main-darkPurple/45 hover:text-main-darkPurple/70 ml-0.5 inline-flex"
          aria-label="How outcomes work"
        >
          <HintIcon className="size-3.5" />
        </button>
      </div>
      {children}
    </section>
  );
}
