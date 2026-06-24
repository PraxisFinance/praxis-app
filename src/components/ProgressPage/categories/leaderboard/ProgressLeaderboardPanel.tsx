"use client";

import { ProgressLeaderboardContent } from "@/components/ProgressPage/categories/leaderboard/ProgressLeaderboardContent";
import { useProgressStore } from "@/stores/progress/store";

export function ProgressLeaderboardPanel() {
  const entries = useProgressStore((state) => state.entries);
  const userEntry = useProgressStore((state) => state.userEntry);
  const loading = useProgressStore((state) => state.loading);
  const error = useProgressStore((state) => state.error);

  if (loading) {
    return (
      <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">
        Loading leaderboard…
      </p>
    );
  }

  if (error != null) {
    return (
      <p className="text-main-darkPurple/50 py-8 text-center text-xs leading-5">{error}</p>
    );
  }

  return <ProgressLeaderboardContent entries={entries} userEntry={userEntry} />;
}
