"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const TEAM_LOGO_FALLBACK = "/icons/question.png";

interface EsportTeamBlockProps {
  name: string;
  logoUrl: string;
  /** Default: centered (logo + name). `end` for right-aligned block. */
  align?: "center" | "end";
}

export function EsportTeamBlock({ name, logoUrl, align = "center" }: EsportTeamBlockProps) {
  const src = logoUrl || TEAM_LOGO_FALLBACK;
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-2",
        align === "end" ? "items-end" : "items-center"
      )}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-main-grayPurple">
        <Image src={src} alt="" fill className="object-cover" sizes="56px" />
      </div>
      <p
        className={cn(
          "text-main-darkPurple w-full truncate text-2xs font-medium leading-tight",
          align === "end" ? "text-right" : "text-center"
        )}
      >
        {name}
      </p>
    </div>
  );
}
