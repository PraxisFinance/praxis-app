"use client";

import Image from "next/image";
import { HintIcon } from "@/components/icons/base/hintIcon";
import { DEFAULT_POOL_USER_CURRENCY_ICON_URL } from "@/shared/constants/randomRewards";
import { isInlineHintIconUrl } from "@/shared/constants/inlineIcons";
import type { RandomPoolUserInPool } from "@/shared/types/randomPool";

export interface RandomPoolUserRowProps {
  user: RandomPoolUserInPool;
}

export function RandomPoolUserRow({ user: u }: RandomPoolUserRowProps) {
  const showHintAvatar = isInlineHintIconUrl(u.avatarUrl);

  return (
    <li className="bg-main-lightGray flex items-center justify-between gap-3 rounded-md px-3 py-1.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="bg-main-grayPurple/80 relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
          {showHintAvatar ? (
            <div className="text-main-darkPurple flex h-full w-full items-center justify-center">
              <HintIcon className="h-5 w-5" aria-hidden />
            </div>
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
        <Image
          src={u.currencyIconUrl ?? DEFAULT_POOL_USER_CURRENCY_ICON_URL}
          alt=""
          width={18}
          height={18}
          className="size-4 shrink-0 object-contain"
        />
        {u.amount}
      </div>
    </li>
  );
}
