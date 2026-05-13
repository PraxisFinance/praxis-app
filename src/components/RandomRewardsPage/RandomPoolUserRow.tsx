"use client";

import Image from "next/image";
import { HintIcon } from "@/components/icons/base/hintIcon";
import { UsdcTokenIcon } from "@/components/icons/base/usdcTokenIcon";
import { WUsdcTokenIcon } from "@/components/icons/base/wUsdcTokenIcon";
import { YtTokenIcon } from "@/components/icons/base/ytTokenIcon";
import { DEFAULT_POOL_USER_CURRENCY_ICON_URL } from "@/shared/constants/randomRewards";
import { isInlineHintIconUrl } from "@/shared/constants/inlineIcons";
import { isUsdcIconUrl, isWUsdcIconUrl, isYtIconUrl } from "@/shared/constants/tokenIconUrls";
import type { RandomPoolUserInPool } from "@/shared/types/randomPool";

export interface RandomPoolUserRowProps {
  user: RandomPoolUserInPool;
}

export function RandomPoolUserRow({ user: u }: RandomPoolUserRowProps) {
  const showHintAvatar = isInlineHintIconUrl(u.avatarUrl);
  const currencyUrl = u.currencyIconUrl ?? DEFAULT_POOL_USER_CURRENCY_ICON_URL;

  return (
    <li className="bg-main-lightGray flex items-center justify-between gap-3 rounded-md px-3 py-1.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="bg-main-grayPurple/80 relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          {showHintAvatar ? (
            <div className="text-main-darkPurple flex h-full w-full items-center justify-center">
              <HintIcon className="h-5 w-5" aria-hidden />
            </div>
          ) : isUsdcIconUrl(u.avatarUrl) ? (
            <span className="flex h-full w-full items-center justify-center" aria-hidden>
              <UsdcTokenIcon size={32} />
            </span>
          ) : isWUsdcIconUrl(u.avatarUrl) ? (
            <span className="flex h-full w-full items-center justify-center" aria-hidden>
              <WUsdcTokenIcon size={32} />
            </span>
          ) : isYtIconUrl(u.avatarUrl) ? (
            <span className="flex h-full w-full items-center justify-center" aria-hidden>
              <YtTokenIcon size={32} />
            </span>
          ) : u.avatarUrl ? (
            <Image
              src={u.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-main-darkPurple flex h-full w-full items-center justify-center text-2xs font-semibold">
              {u.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-main-darkPurple truncate text-sm font-medium">{u.username}</span>
      </div>
      <div className="text-main-darkPurple flex shrink-0 items-center gap-1.5 text-sm font-medium tabular-nums">
        {isUsdcIconUrl(currencyUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <UsdcTokenIcon size={16} />
          </span>
        ) : isWUsdcIconUrl(currencyUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <WUsdcTokenIcon size={16} />
          </span>
        ) : isYtIconUrl(currencyUrl) ? (
          <span className="inline-flex shrink-0" aria-hidden>
            <YtTokenIcon size={16} />
          </span>
        ) : (
          <Image
            src={currencyUrl}
            alt=""
            width={18}
            height={18}
            className="size-4 shrink-0 object-contain"
          />
        )}
        {u.amount}
      </div>
    </li>
  );
}
