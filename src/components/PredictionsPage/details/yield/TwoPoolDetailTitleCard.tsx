"use client";

import { TwoPoolHubCardIcon } from "@/components/PredictionsPage/cards/yield/TwoPoolHubCardIcon";

interface TwoPoolDetailTitleCardProps {
  title: string;
}

export function TwoPoolDetailTitleCard({ title }: TwoPoolDetailTitleCardProps) {
  return (
    <section className="bg-main-lightGray flex items-center gap-3 rounded-[10px] p-3">
      <TwoPoolHubCardIcon size="lg" />
      <h1 className="text-main-darkPurple min-w-0 flex-1 text-base leading-snug font-semibold">
        {title}
      </h1>
    </section>
  );
}
