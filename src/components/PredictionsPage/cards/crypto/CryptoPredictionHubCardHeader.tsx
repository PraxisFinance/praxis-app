"use client";

import Image from "next/image";
import { UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import { EndTimeBadge } from "../shared/EndTimeBadge";

export interface CryptoPredictionHubCardHeaderProps {
  iconUrl: string;
  title: string;
  endLine: string;
  volumeLabel?: string;
}

export function CryptoPredictionHubCardHeader({
  iconUrl,
  title,
  endLine,
  volumeLabel,
}: CryptoPredictionHubCardHeaderProps) {
  return (
    <div className="flex-col gap-0.5">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 shrink-0">
          {iconUrl ? (
            isUsdcIconUrl(iconUrl) ? (
              <span className="inline-flex" aria-hidden>
                <UsdcTokenIcon size={32} />
              </span>
            ) : isWUsdcIconUrl(iconUrl) ? (
              <span className="inline-flex" aria-hidden>
                <WUsdcTokenIcon size={32} />
              </span>
            ) : isYtIconUrl(iconUrl) ? (
              <span className="inline-flex" aria-hidden>
                <YtTokenIcon size={32} />
              </span>
            ) : (
              <Image src={iconUrl} alt="" width={36} height={36} className="object-contain" />
            )
          ) : (
            <span className="bg-main-grayPurple block h-9 w-9 rounded-lg" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-main-darkPurple text-sm leading-tight">{title}</h3>
        </div>

        <EndTimeBadge endLine={endLine} />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {volumeLabel ? (
          <span className="text-main-darkPurple/55 text-2xs leading-tight tabular-nums">
            {volumeLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
