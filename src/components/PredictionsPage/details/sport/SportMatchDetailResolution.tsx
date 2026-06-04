"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";

interface SportMatchDetailResolutionProps {
  clubName: string;
  opponentName: string;
  resolutionDeadlineLabel?: string;
}

export function SportMatchDetailResolution({
  clubName,
  opponentName,
  resolutionDeadlineLabel = "June 23, 2026",
}: SportMatchDetailResolutionProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-xl">Resolution</SectionHeader>
      <div className="text-main-darkPurple space-y-3 text-sm leading-relaxed">
        <p>
          This market resolves to &ldquo;YES&rdquo; if the club named in the title is winning after 90
          minutes plus stoppage time in the listed match. Otherwise, the market will resolve to
          &ldquo;NO.&rdquo;
        </p>
        <p>
          If the match is not completed by {resolutionDeadlineLabel}, the market will resolve based on
          the official result at the time of suspension or cancellation.
        </p>
        <p>
          For this fixture, a lead by <span className="underline">{clubName}</span> over{" "}
          <span className="underline">{opponentName}</span> at full time settles the market in favor of
          the named club.
        </p>
      </div>
    </section>
  );
}
