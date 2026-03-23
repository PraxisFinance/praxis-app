"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEFAULT_POOL_USER_CURRENCY_ICON_URL } from "@/shared/constants/randomRewards";
import type { RandomPoolUserInPool } from "@/shared/types/randomPool";

export interface RandomPoolParticipantListProps {
  title: string;
  users: RandomPoolUserInPool[];
}

export function RandomPoolParticipantList({ title, users }: RandomPoolParticipantListProps) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">{title}</SectionHeader>
      <ul className="flex flex-col gap-2">
        {users.map((u) => (
          <li
            key={`${u.username}-${u.amount}`}
            className="bg-main-lightGray flex items-center justify-between gap-3 rounded-md px-3 py-1.5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="bg-main-grayPurple/80 relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                {u.avatarUrl ? (
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
        ))}
      </ul>
    </section>
  );
}
