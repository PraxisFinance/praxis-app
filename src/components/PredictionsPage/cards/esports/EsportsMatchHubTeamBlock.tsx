"use client";

import Image from "next/image";
import { getEsportsTeamInitials } from "@/shared/utils/esportsTeamDisplay";
import { cn } from "@/lib/utils";

interface EsportsMatchHubTeamBlockProps {
  name: string;
  logoUrl: string;
  align?: "center" | "end";
}

export function EsportsMatchHubTeamBlock({
  name,
  logoUrl,
  align = "center",
}: EsportsMatchHubTeamBlockProps) {
  const trimmedUrl = logoUrl.trim();
  const showLogo = Boolean(trimmedUrl);
  const initials = getEsportsTeamInitials(name);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-2",
        align === "end" ? "items-end" : "items-center",
      )}
    >
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-main-grayPurple">
        {showLogo ? (
          <Image src={trimmedUrl} alt="" fill className="object-cover" sizes="56px" />
        ) : (
          <span
            className={cn(
              "text-main-darkPurple px-1 text-center font-semibold leading-none tracking-tight",
              initials.length <= 2 ? "text-xl" : "text-xs",
            )}
          >
            {initials}
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-main-darkPurple w-full truncate text-2xs font-medium leading-tight",
          align === "end" ? "text-right" : "text-center",
        )}
      >
        {name}
      </p>
    </div>
  );
}
