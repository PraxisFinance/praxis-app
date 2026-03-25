"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

function getTeamInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  const letters = words
    .map((w) => {
      const c = w.charAt(0);
      return c ? c.toLocaleUpperCase() : "";
    })
    .join("");
  return letters || "?";
}

interface EsportTeamBlockProps {
  name: string;
  logoUrl: string;
  /** Default: centered (logo + name). `end` for right-aligned block. */
  align?: "center" | "end";
}

export function EsportTeamBlock({ name, logoUrl, align = "center" }: EsportTeamBlockProps) {
  const trimmedUrl = logoUrl.trim();
  const showLogo = Boolean(trimmedUrl);
  const initials = getTeamInitials(name);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-2",
        align === "end" ? "items-end" : "items-center"
      )}
    >
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-main-grayPurple">
        {showLogo ? (
          <Image src={trimmedUrl} alt="" fill className="object-cover" sizes="56px" />
        ) : (
          <span
            className={cn(
              "text-main-darkPurple px-1 text-center font-semibold leading-none tracking-tight",
              initials.length <= 2 ? "text-xl" : "text-xs"
            )}
          >
            {initials}
          </span>
        )}
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
