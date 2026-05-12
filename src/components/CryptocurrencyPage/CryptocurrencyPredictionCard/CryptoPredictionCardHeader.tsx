"use client";

import Image from "next/image";
import { UsdcTokenIcon } from "@/components/icons/base/usdcTokenIcon";
import { WUsdcTokenIcon } from "@/components/icons/base/wUsdcTokenIcon";
import { YtTokenIcon } from "@/components/icons/base/ytTokenIcon";
import { StatBadge } from "@/components/ui/StatBadge";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import { cn } from "@/lib/utils";

export interface CryptoPredictionCardHeaderProps {
  iconUrl: string;
  title: string;
  endLine: string;
}

function EndLineBadge({ endLine }: { endLine: string }) {
  const colonIdx = endLine.indexOf(": ");
  if (colonIdx >= 0) {
    return (
      <StatBadge
        label={endLine.slice(0, colonIdx)}
        value={endLine.slice(colonIdx + 2)}
        className="max-w-[min(100%,160px)] whitespace-normal"
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-[min(100%,160px)] shrink-0 rounded-[6px] bg-main-grayPurple/55 px-1.5 py-1 whitespace-normal"
      )}
    >
      <span className="text-main-darkPurple text-2xs leading-tight">{endLine}</span>
    </div>
  );
}

export function CryptoPredictionCardHeader({
  iconUrl,
  title,
  endLine,
}: CryptoPredictionCardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9 shrink-0">
        {iconUrl ? (
          isUsdcIconUrl(iconUrl) ? (
            <span className="inline-flex" aria-hidden>
              <UsdcTokenIcon className="h-9 w-9" />
            </span>
          ) : isWUsdcIconUrl(iconUrl) ? (
            <span className="inline-flex" aria-hidden>
              <WUsdcTokenIcon className="h-9 w-9" />
            </span>
          ) : isYtIconUrl(iconUrl) ? (
            <span className="inline-flex" aria-hidden>
              <YtTokenIcon className="h-9 w-9" />
            </span>
          ) : (
            <Image src={iconUrl} alt="" width={36} height={36} className="object-contain" />
          )
        ) : (
          <span className="bg-main-grayPurple block h-9 w-9 rounded-lg" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-main-darkPurple text-sm font-semibold leading-tight">{title}</h3>
      </div>
      <EndLineBadge endLine={endLine} />
    </div>
  );
}
