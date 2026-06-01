"use client";

import { usePathname, useRouter } from "next/navigation";
import { PredictionsTabBar } from "@/components/PredictionsPage/PredictionsTabBar";
import {
  isRandomRewardsPoolDetailPath,
  isTwoPoolDetailPath,
  PREDICTIONS_ROUTE,
} from "@/lib/routes";

export function PredictionsTabBarHost() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === PREDICTIONS_ROUTE) {
    return null;
  }

  const showBackButton =
    isRandomRewardsPoolDetailPath(pathname) || isTwoPoolDetailPath(pathname);

  return <PredictionsTabBar showBackButton={showBackButton} onBack={() => router.back()} />;
}
