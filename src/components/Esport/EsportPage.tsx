"use client";

import { useState } from "react";
import type { EsportsGameFilterId, EsportsTimeFilterId } from "@/shared/constants/esports";
import { ESPORTS_MATCH_MOCKS } from "@/shared/constants/esportsMatches";
import type { EsportsMatch } from "@/shared/types/esportsMatch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EsportFilters } from "./EsportFilters";
import { EsportMatchCard } from "./EsportMatchCard";
import { EsportPredictionDrawer } from "./EsportPredictionDrawer";

export function EsportPage() {
  const [gameFilter, setGameFilter] = useState<EsportsGameFilterId | null>(null);
  const [timeFilter, setTimeFilter] = useState<EsportsTimeFilterId | null>("all");

  const [predictionOpen, setPredictionOpen] = useState(false);
  const [predictionMatch, setPredictionMatch] = useState<EsportsMatch | null>(null);
  const [predictionSide, setPredictionSide] = useState<"team1" | "team2" | null>(null);

  const handlePredictionOpenChange = (next: boolean) => {
    setPredictionOpen(next);
    if (!next) {
      setPredictionMatch(null);
      setPredictionSide(null);
    }
  };

  const openPrediction = (match: EsportsMatch, side: "team1" | "team2") => {
    setPredictionMatch(match);
    setPredictionSide(side);
    setPredictionOpen(true);
  };

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
            <EsportMatchCard
              key={match.id}
              match={match}
              onPickTeam={(side) => openPrediction(match, side)}
            />
          ))}
        </div>
      </section>

      <EsportPredictionDrawer
        match={predictionMatch}
        side={predictionSide}
        open={predictionOpen}
        onOpenChange={handlePredictionOpenChange}
      />
    </div>
  );
}
