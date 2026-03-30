"use client";

import { useState } from "react";
import type { EsportsGameFilterId, EsportsTimeFilterId } from "@/shared/constants/esports";
import { EsportFilters } from "./EsportFilters";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function EsportPage() {
  const [gameFilter, setGameFilter] = useState<EsportsGameFilterId | null>("valorant");
  const [timeFilter, setTimeFilter] = useState<EsportsTimeFilterId | null>("all");

  return (
    <div className="flex flex-col gap-4">
      <EsportFilters
        gameId={gameFilter}
        onGameChange={setGameFilter}
        timeId={timeFilter}
        onTimeChange={setTimeFilter}
      />
      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Markets</SectionHeader>
        <p className="text-main-darkPurple text-sm font-normal leading-5">
          Esports predictions and markets will appear here soon.
        </p>
      </section>
    </div>
  );
}
