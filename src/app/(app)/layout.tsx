"use client";

import { useBaseName } from "@/hooks/useBaseName";
import { useHydrated } from "@/hooks/useHydrated";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ActiveVaultBoot } from "@/components/ActiveVaultBoot";
import { AuthBoot } from "@/components/AuthBoot";
import { AchievementCompletedDrawerHost } from "@/components/ProgressPage/drawers/AchievementCompletedDrawerHost";
import { StaleVaultBanner } from "@/components/ui/StaleVaultBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const { displayName } = useBaseName();
  const username = hydrated ? (displayName ?? "Not connected") : "Not connected";

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-white">
      <ActiveVaultBoot />
      <AuthBoot />
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
        <header className="shrink-0 bg-white px-5 pt-7 pb-0">
          <Header username={username} points={1000} />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pt-6 pb-24">
          <StaleVaultBanner />
          {children}
        </main>
      </div>

      <BottomNav />
      <AchievementCompletedDrawerHost />
    </div>
  );
}
