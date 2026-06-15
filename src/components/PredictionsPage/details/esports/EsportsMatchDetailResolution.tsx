"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import type { EsportsMatch } from "@/shared/types/esportsMatch";

interface EsportsMatchDetailResolutionProps {
  match: EsportsMatch;
}

export function EsportsMatchDetailResolution({ match }: EsportsMatchDetailResolutionProps) {
  const winnerName = match.participantA.name;
  const loserName = match.participantB.name;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-xl">Resolution</SectionHeader>
      <div className="text-main-darkPurple space-y-3 text-sm leading-relaxed">
        <p>
          This market resolves to &ldquo;YES&rdquo; if the team named in the title wins in the specified
          match. Otherwise, the market will resolve to &ldquo;NO.&rdquo; If either team loses by
          forfeit, disqualification, or walkover for any reason, this market will resolve to the team
          declared the winner.
        </p>
        <p>
          For this market, a win by <span className="underline">{winnerName}</span> over{" "}
          <span className="underline">{loserName}</span> in the listed fixture settles the market in
          favor of the named team.
        </p>
      </div>
    </section>
  );
}
