import Image from "next/image";
import { UsdcTokenIcon } from "@/components/icons/base/usdcTokenIcon";
import { WUsdcTokenIcon } from "@/components/icons/base/wUsdcTokenIcon";
import { YtTokenIcon } from "@/components/icons/base/ytTokenIcon";
import { Button } from "@/components/ui/button";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import type { RewardClaimItem } from "@/shared/types/profile";

interface RewardClaimRowProps {
  item: RewardClaimItem;
  onClaim: (id: string) => void;
}

export function RewardClaimRow({ item, onClaim }: RewardClaimRowProps) {
  return (
    <div className="flex items-center gap-3 bg-main-lightGray rounded-sm px-3.5 py-3">
      {isUsdcIconUrl(item.iconUrl) ? (
        <span className="inline-flex shrink-0" aria-hidden>
          <UsdcTokenIcon />
        </span>
      ) : isWUsdcIconUrl(item.iconUrl) ? (
        <span className="inline-flex shrink-0" aria-hidden>
          <WUsdcTokenIcon />
        </span>
      ) : isYtIconUrl(item.iconUrl) ? (
        <span className="inline-flex shrink-0" aria-hidden>
          <YtTokenIcon />
        </span>
      ) : (
        <Image src={item.iconUrl} alt={item.name} width={24} height={24} className="shrink-0" />
      )}

      <span className="flex-1 text-main-darkPurple text-xs leading-5 min-w-0 truncate">
        {item.name}
      </span>

      <span className="shrink-0 text-main-darkPurple text-xs leading-5 whitespace-nowrap">
        Income:{" "}
        <span className="font-medium">{item.income} {item.incomeCurrency}</span>
      </span>

      <Button variant="primary" size="sm" onClick={() => onClaim(item.id)} className="shrink-0">
        Claim
      </Button>
    </div>
  );
}
