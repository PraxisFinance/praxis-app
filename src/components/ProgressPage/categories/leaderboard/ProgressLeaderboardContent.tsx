"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressLeaderboardUserRow } from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardUserRow";
import type { ProgressLeaderboardEntry } from "@/stores/progress/leaderboard/types";

export interface ProgressLeaderboardContentProps {
  entries: ProgressLeaderboardEntry[];
  userEntry: ProgressLeaderboardEntry | null;
}

export function ProgressLeaderboardContent({
  entries,
  userEntry,
}: ProgressLeaderboardContentProps) {
  return (
    <div className="flex min-h-full flex-col gap-5 pb-8">
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

      {userEntry != null ? (
        <section className="flex flex-col gap-3">
          <SectionHeader className="text-main-darkPurple">Your place</SectionHeader>
          <ProgressLeaderboardUserRow entry={userEntry} />
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <SectionHeader className="text-main-darkPurple">Top users</SectionHeader>
        {entries.length > 0 ? (
          <ul className="flex flex-col gap-2.5">
            {entries.map((entry) => (
              <li key={entry.id}>
                <ProgressLeaderboardUserRow entry={entry} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
            No leaderboard entries yet.
          </p>
        )}
      </section>
    </div>
  );
}
