"use client";

import { useBaseName } from "@/hooks/useBaseName";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { displayName } = useBaseName();

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-white">
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col">
        <header className="shrink-0 bg-white px-5 pt-7 pb-0">
          <Header username={displayName ?? "Not connected"} points={1000} />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pt-6 pb-24">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
