"use client";

import { usePathname, useRouter } from "next/navigation";
import { PredictionsTabBar } from "@/components/PredictionsPage/PredictionsTabBar";

export function PredictionsTabBarHost() {
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = /^\/predictions\/random-rewards\/[^/]+$/.test(pathname);

  return (
    <PredictionsTabBar showBackButton={showBackButton} onBack={() => router.back()} />
  );
}
