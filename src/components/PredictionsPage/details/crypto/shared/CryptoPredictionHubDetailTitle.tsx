"use client";

import Image from "next/image";
import { UsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { isUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";

interface CryptoPredictionHubDetailTitleProps {
  iconUrl: string;
  title: string;
}

export function CryptoPredictionHubDetailTitle({
  iconUrl,
  title,
}: CryptoPredictionHubDetailTitleProps) {
  return (
    <section className="bg-main-lightGray flex items-center gap-3 rounded-[10px] p-3">
      <div className="bg-main-white flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full">
        {iconUrl ? (
          isUsdcIconUrl(iconUrl) ? (
            <UsdcTokenIcon size={32} />
          ) : isYtIconUrl(iconUrl) ? (
            <YtTokenIcon size={32} />
          ) : (
            <Image src={iconUrl} alt="" width={36} height={36} className="object-contain" />
          )
        ) : (
          <span className="bg-main-grayPurple block h-9 w-9 rounded-full" aria-hidden />
        )}
      </div>
      <h1 className="text-main-darkPurple min-w-0 flex-1 text-base leading-snug font-medium">
        {title}
      </h1>
    </section>
  );
}
