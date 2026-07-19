import Image from "next/image";
import { UsdcTokenIcon, YtTokenIcon } from "@/components/icons/base";
import { Button } from "@/components/ui/button";
import { isUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import type { RewardClaimItem } from "@/shared/types/profile";

interface RewardClaimRowProps {
  item: RewardClaimItem;
  onClaim: (id: string) => void;
  isPending?: boolean;
  errorMessage?: string | null;
}

export function RewardClaimRow({ item, onClaim, isPending, errorMessage }: RewardClaimRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3 bg-main-lightGray rounded-sm px-3.5 py-3">
        {isUsdcIconUrl(item.iconUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <UsdcTokenIcon />
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

        <Button
          variant="primary"
          size="sm"
          onClick={() => onClaim(item.id)}
          disabled={isPending}
          className="shrink-0"
        >
          {isPending ? "Claiming…" : "Claim"}
        </Button>
      </div>

      {errorMessage && (
        <p className="px-3.5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
