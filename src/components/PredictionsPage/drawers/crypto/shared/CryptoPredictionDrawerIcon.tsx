"use client";

import Image from "next/image";
import { UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";

interface CryptoPredictionDrawerIconProps {
  iconUrl: string;
}

export function CryptoPredictionDrawerIcon({ iconUrl }: CryptoPredictionDrawerIconProps) {
  const size = 24;
  const trimmed = iconUrl.trim();

  if (!trimmed) {
    return <span className="bg-main-grayPurple block rounded-full" style={{ width: size, height: size }} aria-hidden />;
  }

  if (isUsdcIconUrl(trimmed)) {
    return (
      <span className="inline-flex overflow-hidden rounded-full" aria-hidden>
        <UsdcTokenIcon size={size} />
      </span>
    );
  }

  if (isWUsdcIconUrl(trimmed)) {
    return (
      <span className="inline-flex overflow-hidden rounded-full" aria-hidden>
        <WUsdcTokenIcon size={size} />
      </span>
    );
  }

  if (isYtIconUrl(trimmed)) {
    return (
      <span className="inline-flex overflow-hidden rounded-full" aria-hidden>
        <YtTokenIcon size={size} />
      </span>
    );
  }

  return (
    <span className="relative inline-flex shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image src={trimmed} alt="" width={size} height={size} className="object-cover" />
    </span>
  );
}
