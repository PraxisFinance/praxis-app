import Image from "next/image";

import { UsdcTokenIcon } from "@/components/icons/base/usdcTokenIcon";
import { WUsdcTokenIcon } from "@/components/icons/base/wUsdcTokenIcon";
import { YtTokenIcon } from "@/components/icons/base/ytTokenIcon";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";

interface BalanceCardProps {
  label: string;
  value: string;
  iconUrl: string;
}

export function BalanceCard({ label, value, iconUrl }: BalanceCardProps) {
  return (
    <div className="px-2.5 py-[5px] bg-slate-200 rounded-[5px] inline-flex flex-col justify-start items-start gap-[5px]">
      <div className="text-indigo-950 text-sm font-normal leading-4">{label}</div>
      <div className="inline-flex justify-start items-center gap-[5px]">
        {isUsdcIconUrl(iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <UsdcTokenIcon className="h-4 w-4" />
          </span>
        ) : isWUsdcIconUrl(iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <WUsdcTokenIcon className="h-4 w-4" />
          </span>
        ) : isYtIconUrl(iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <YtTokenIcon className="h-4 w-4" />
          </span>
        ) : (
          <Image src={iconUrl} alt={label} width={16} height={16} className="w-4 h-4" />
        )}
        <div className="text-indigo-950 text-base font-medium leading-5">{value}</div>
      </div>
    </div>
  );
}
