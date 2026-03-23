"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEFAULT_POOL_USER_CURRENCY_ICON_URL, MOCK_USERS_IN_POOL } from "@/shared/constants/randomRewards";
import type { RandomPoolLive } from "@/shared/types/randomPool";
import { RandomPoolMainData } from "./RandomPoolMainData";

export interface RandomPoolLiveDetailsProps {
  pool: RandomPoolLive;
  amount: string;
  onAmountChange: (value: string) => void;
  walletBalance: string;
}

export function RandomPoolLiveDetails({
  pool,
  amount,
  onAmountChange,
  walletBalance,
}: RandomPoolLiveDetailsProps) {
  return (
    <div className="flex flex-col gap-3">
      <RandomPoolMainData pool={pool} />

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">Join Pool</SectionHeader>
        <InputWithMax
          value={amount}
          onChange={onAmountChange}
          maxValue={walletBalance}
          placeholder="Deposit amount"
        />
        <Button
          type="button"
          variant="success"
          size="action"
        >
          Join pool
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple text-lg font-bold leading-6">Users in pool</SectionHeader>
        <ul className="flex flex-col gap-2">
          {MOCK_USERS_IN_POOL.map((u) => (
            <li
              key={u.username}
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
    </div>
  );
}
