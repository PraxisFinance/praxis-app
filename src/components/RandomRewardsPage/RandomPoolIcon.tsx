"use client";

import Image from "next/image";
import { HintIcon, UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { isInlineHintIconUrl } from "@/shared/constants/inlineIcons";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";

export type RandomPoolIconVariant = "list" | "details";

export interface RandomPoolIconProps {
  iconUrl?: string;
  /** Used for image `alt` (e.g. pool title). */
  alt: string;
  variant: RandomPoolIconVariant;
}

export function RandomPoolIcon({ iconUrl, alt, variant }: RandomPoolIconProps) {
  const showHint = isInlineHintIconUrl(iconUrl);

  if (variant === "list") {
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
        ) : isWUsdcIconUrl(iconUrl) ? (
          <span className="flex h-full w-full items-center justify-center" aria-hidden>
            <WUsdcTokenIcon size={32} />
          </span>
        ) : isYtIconUrl(iconUrl) ? (
          <span className="flex h-full w-full items-center justify-center" aria-hidden>
            <YtTokenIcon size={32} />
          </span>
        ) : iconUrl ? (
          <Image
            src={iconUrl}
            alt={alt}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg">🪙</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-main-lightGray ring-main-grayPurple/40 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm ring-1 ring-inset">
      {showHint ? (
        <HintIcon className="text-main-darkPurple h-9 w-9" aria-hidden />
      ) : isUsdcIconUrl(iconUrl) ? (
        <span className="flex h-9 w-9 items-center justify-center" aria-hidden>
          <UsdcTokenIcon size={32} />
        </span>
      ) : isWUsdcIconUrl(iconUrl) ? (
        <span className="flex h-9 w-9 items-center justify-center" aria-hidden>
          <WUsdcTokenIcon size={32} />
        </span>
      ) : isYtIconUrl(iconUrl) ? (
        <span className="flex h-9 w-9 items-center justify-center" aria-hidden>
          <YtTokenIcon size={32} />
        </span>
      ) : iconUrl ? (
        <Image src={iconUrl} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center text-xl leading-none">🪙</div>
      )}
    </div>
  );
}
