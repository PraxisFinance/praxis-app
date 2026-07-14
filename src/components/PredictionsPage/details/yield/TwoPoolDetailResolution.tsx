"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";

interface TwoPoolDetailResolutionProps {
  paragraphs: string[];
}

export function TwoPoolDetailResolution({ paragraphs }: TwoPoolDetailResolutionProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-xl">Resolution</SectionHeader>
      <div className="text-main-darkPurple space-y-3 text-sm leading-relaxed">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
