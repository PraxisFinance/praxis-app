"use client";

import { useState } from "react";
import type { EsportsGameFilterId, EsportsTimeFilterId } from "@/shared/constants/esports";
import { ESPORTS_MATCH_MOCKS } from "@/shared/constants/esportsMatches";
import { EsportFilters } from "./EsportFilters";
import { EsportMatchCard } from "./EsportMatchCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function EsportPage() {
  const [gameFilter, setGameFilter] = useState<EsportsGameFilterId | null>(null);
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
        <SectionHeader className="text-main-darkPurple">Matches</SectionHeader>
        <div className="flex flex-col gap-3">
          {ESPORTS_MATCH_MOCKS.map((match) => (
            <EsportMatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  );
}
