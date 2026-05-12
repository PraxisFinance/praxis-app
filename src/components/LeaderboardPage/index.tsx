"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowIcon } from "@/components/ui";
import { PraxisBtnIcon } from "@/components/icons/brand/praxisBtnIcon";
import {
  LEADERBOARD_TOP_USERS,
  LEADERBOARD_YOUR_PLACE,
} from "@/shared/constants/leaderboard";
import { formatScore } from "@/stores";

const scoreColumnClassName =
  "text-main-darkPurple flex min-w-[5.75rem] max-w-[7.5rem] shrink-0 flex-row items-center justify-start gap-2 text-left text-sm font-medium tabular-nums leading-normal sm:min-w-[6.5rem] sm:text-base";

const userRowClassName =
  "bg-main-lightGray flex flex-row items-center gap-3 rounded-lg px-3 py-2";

function LeaderboardUserRow({
  name,
  score,
}: {
  name: string;
  score: number;
}) {
  return (
    <div className={userRowClassName}>
      <div className="flex min-w-0 flex-1 flex-row items-center gap-2.5">
        <div className="bg-main-purple/40 size-8 shrink-0 rounded-full" />
        <span className="text-main-darkPurple truncate text-sm font-medium leading-normal sm:text-base">
          {name}
        </span>
      </div>
      <div className={scoreColumnClassName}>
        <span className="inline-flex shrink-0" aria-hidden>
          <PraxisBtnIcon />
        </span>
        <span className="min-w-0">{formatScore(score)}</span>
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col gap-5 pb-8">
      <div className="flex flex-row flex-wrap items-center gap-2.5">
        <Button variant="pillPrimary" size="pill" onClick={() => router.back()}>
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Back
        </Button>

        <Button variant="pillSecondary" size="pill" onClick={() => router.push("/main")}>
          Main menu
        </Button>
      </div>

      <section className="bg-main-lightGray relative min-h-28 overflow-hidden rounded-lg px-3 py-4 sm:min-h-32 sm:px-4">
        <Image
          src="/leaderboard/card-bg.png"
          alt=""
          fill
          className="object-cover object-right"
          sizes="(max-width: 28rem) 100vw, 28rem"
          priority
        />
        <div className="relative z-10 flex min-w-0 max-w-[65%] flex-col justify-center gap-2">
          <h1 className="text-main-darkPurple text-2xl font-medium leading-tight sm:text-3xl">
            Leaderboard
          </h1>
          <p className="text-main-darkPurple text-sm leading-snug sm:text-base">
            Develop your own strategy and compete with other players
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Your place</SectionHeader>
        <LeaderboardUserRow name={LEADERBOARD_YOUR_PLACE.name} score={LEADERBOARD_YOUR_PLACE.score} />
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Top users</SectionHeader>
        <ul className="flex flex-col gap-2.5">
          {LEADERBOARD_TOP_USERS.map((user) => (
            <li key={user.id}>
              <LeaderboardUserRow name={user.name} score={user.score} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
