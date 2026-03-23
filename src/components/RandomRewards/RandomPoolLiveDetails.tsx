"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InputWithMax } from "@/components/ui/InputWithMax";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MOCK_USERS_IN_POOL } from "@/shared/constants/randomRewards";
import { formatRandomPoolRemainingTime } from "@/shared/utils/randomPoolFormat";
import type { RandomPoolLive } from "@/shared/types/randomPool";
import { RandomPoolStatCard } from "./RandomPoolStatCard";

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
      <div className="flex gap-3">
        <div className="bg-main-lightGray ring-main-grayPurple/40 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm ring-1 ring-inset">
          {pool.iconUrl ? (
            <Image
              src={pool.iconUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center text-xl leading-none">🪙</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-main-darkPurple text-lg leading-tight">{pool.title}</h1>
          <p className="text-main-darkPurple/60 mt-1 text-sm leading-snug">
            {formatRandomPoolRemainingTime(pool.remainingTime)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-start gap-2">
        <RandomPoolStatCard label="Pool TVL" value={pool.tvl} />
        <RandomPoolStatCard label="Expected yield" value={pool.expectedYield} />
        <RandomPoolStatCard label="Users in pool" value={String(pool.usersIn)} />
      </div>

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
              className="bg-main-lightGray flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="bg-main-grayPurple/80 text-main-darkPurple flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-main-darkPurple truncate text-sm font-medium">{u.username}</span>
              </div>
              <div className="text-main-darkPurple flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums">
                <span className="text-base leading-none" aria-hidden>
                  🪙
                </span>
                {u.amount}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
