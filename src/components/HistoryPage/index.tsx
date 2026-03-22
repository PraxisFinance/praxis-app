"use client";

import { OnDevelopmentPage } from "@/components/OnDevelopmentPage";
import { useRouter } from "next/navigation";

export function HistoryPage() {
  const router = useRouter();

  return <OnDevelopmentPage onBack={() => router.back()} onMainMenu={() => router.push("/main")} />;
}
