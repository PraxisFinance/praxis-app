import Image from "next/image";

import { UsdcTokenIcon, WUsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { cn } from "@/lib/utils";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";

interface PoolHeaderProps {
  iconUrl: string;
  name: string;
  subtitle?: string;
  /** Use in drawer context for bolder name */
  emphasized?: boolean;
}

export function PoolHeader({ iconUrl, name, subtitle, emphasized }: PoolHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5">
        {isUsdcIconUrl(iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <UsdcTokenIcon size={32} className="rounded-full" />
          </span>
        ) : isWUsdcIconUrl(iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <WUsdcTokenIcon size={32} className="rounded-full" />
          </span>
        ) : isYtIconUrl(iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <YtTokenIcon size={32} className="rounded-full" />
          </span>
        ) : (
          <Image
            src={iconUrl}
            alt={name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full shrink-0"
          />
        )}
        <span
          className={cn("text-main-darkPurple text-base leading-5", emphasized && "font-semibold")}
        >
          {name}
        </span>
      </div>
      {subtitle && (
        <span className="text-main-darkPurple text-2xs font-normal leading-3 whitespace-nowrap">
          {subtitle}
        </span>
      )}
    </div>
  );
}
