"use client";

import { usePathname, useRouter } from "next/navigation";
import { PredictionsTabBar } from "@/components/PredictionsPage/PredictionsTabBar";
import { isRandomRewardsPoolDetailPath } from "@/lib/routes";

export function PredictionsTabBarHost() {
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = isRandomRewardsPoolDetailPath(pathname);

  return (
    <PredictionsTabBar showBackButton={showBackButton} onBack={() => router.back()} />
  );
}
