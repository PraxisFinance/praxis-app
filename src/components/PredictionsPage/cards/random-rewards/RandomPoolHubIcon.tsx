"use client";

import Image from "next/image";
import { HintIcon, UsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { isInlineHintIconUrl } from "@/shared/constants/inlineIcons";
import { isUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";

interface RandomPoolHubIconProps {
  iconUrl?: string;
  alt: string;
}

export function RandomPoolHubIcon({ iconUrl, alt }: RandomPoolHubIconProps) {
  const showHint = isInlineHintIconUrl(iconUrl);

  return (
    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-amber-100/80">
      {showHint ? (
        <div className="text-main-darkPurple flex h-full w-full items-center justify-center">
          <HintIcon className="h-6 w-6" aria-hidden />
        </div>
      ) : isUsdcIconUrl(iconUrl) ? (
        <span className="flex h-full w-full items-center justify-center" aria-hidden>
          <UsdcTokenIcon size={32} />
        </span>
      ) : isYtIconUrl(iconUrl) ? (
        <span className="flex h-full w-full items-center justify-center" aria-hidden>
          <YtTokenIcon size={32} />
        </span>
      ) : iconUrl ? (
        <Image src={iconUrl} alt={alt} width={36} height={36} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg">🪙</div>
      )}
    </div>
  );
}
